import { IIpfsConnector } from '../ipfs/types';
import { IEthereumConnector } from '../ethereum/types';
import { IdentityWallet } from '../identityWallet/identityWallet';
import { privateKeyToPublicKey, privateKeyToDID } from '../utils/crypto'
import { DidDocument } from '../identity/didDocument'
import { IDidDocumentAttrs } from '../identity/didDocument/types';
import {
  IRegistryCommitArgs,
  IRegistryInstanceCreationArgs,
  IRegistryStaticCreationArgs
} from './types'
import { SignedCredential } from '../credentials/signedCredential';

/** Jolocom specific Registry, which uses IPFS
 *  and Ethereum for registering the indentity and the resolution
 *  mechanism.
 */
export class JolocomRegistry {
  public ipfsConnector: IIpfsConnector
  public ethereumConnector: IEthereumConnector

  public static create({ ipfsConnector, ethereumConnector }: IRegistryStaticCreationArgs): JolocomRegistry {
    const jolocomRegistry = new JolocomRegistry()
    jolocomRegistry.ipfsConnector = ipfsConnector
    jolocomRegistry.ethereumConnector = ethereumConnector

    return jolocomRegistry
  }

  public async create(args: IRegistryInstanceCreationArgs): Promise<IdentityWallet> {
    const { privateIdentityKey, privateEthereumKey} = args
    const ddo = new DidDocument().fromPublicKey(privateKeyToPublicKey(privateIdentityKey))

    const identityWallet = new IdentityWallet()
    identityWallet.setDidDocument(ddo)
    identityWallet.setPrivateIdentityKey(args.privateIdentityKey)

    await this.commit({wallet: identityWallet, privateEthereumKey})

    return identityWallet
  }

  public async commit({ wallet, privateEthereumKey }: IRegistryCommitArgs): Promise<void> {
    const ddo = wallet.getDidDocument()
    this.unpin(ddo.getDID())

    let ipfsHash
    try {
      ipfsHash = await this.ipfsConnector.storeJSON({data: ddo, pin: true})
    } catch (error) {
      throw new Error(`Could not save DID record on IPFS. ${error.message}`)
    }

    try {
      return await this.ethereumConnector.updateDIDRecord({
        ethereumKey: privateEthereumKey,
        did: ddo.getDID(),
        newHash: ipfsHash
      })
    } catch (error) {
      throw new Error(`Could not register DID record on Ethereum. ${error.message}`)
    }
  }

  private async unpin(did): Promise<void> {
    try {
      const hash = await this.ethereumConnector.resolveDID(did)
      await this.ipfsConnector.removePinnedHash(hash)
    } catch (err) {
      if (err.message.match('Removing pinned hash')) { throw err }
      return
    }
  }

  public async resolve(did): Promise<Identity> {
    try {
      const hash = await this.ethereumConnector.resolveDID(did)
      const ddo = DidDocument.fromJSON(await this.ipfsConnector.catJSON(hash) as IDidDocumentAttrs)
      const service = ddo.getServiceEndpoints() // implemented?
      const ppEndpoint = service.map((endpoint) => (endpoint.type === 'PublicProfile') && endpoint)

      return new Identity.create({
        didDocument: ddo,
        publicProfile: await this.resolveServiceEndpoint(ppEndpoint)
      })
    } catch (error) {
      throw new Error(`Could not retrieve DID Document. ${error.message}`)
    }
  }

  // TODO: rename to include public profile indication?
  public async resolveServiceEndpoint(endpointSection: IServiceEndpointSectionAttrs): SignedCredential {
    const ipfsHash = endpointSection.type.replace('ipfs://', '')
    const publicProfile =  await this.ipfsConnector.catJSON(ipfsHash) as ISignedCredentialAttrs
    return SignedCredential.fromJSON(publicProfile)
  }

  public async authenticate(privateIdentityKey: Buffer): Promise<IdentityWallet> {
    const identityWallet = new IdentityWallet()
    const did = privateKeyToDID(privateIdentityKey)
    const identity = await this.resolve(did)

    return IdentityWallet.create({privateIdentityKey, identity})
  }
}
