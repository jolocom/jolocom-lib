import { IIpfsConnector } from '../ipfs/types'
import { IEthereumConnector } from '../ethereum/types'
import { IdentityWallet } from '../identityWallet/identityWallet'
import { privateKeyToPublicKey, privateKeyToDID } from '../utils/crypto'
import { DidDocument } from '../identity/didDocument'
import { IDidDocumentAttrs } from '../identity/didDocument/types'
import { IServiceEndpointSectionAttrs } from '../identity/didDocument/sections/types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'
import { Identity } from '../identity/identity'
import {
  IRegistryCommitArgs,
  IRegistryInstanceCreationArgs,
  IRegistryStaticCreationArgs
} from './types'

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
    const ddoAttr = new DidDocument()
      .fromPublicKey(privateKeyToPublicKey(privateIdentityKey))
      .toJSON()
    const identity = Identity.create({didDocument: ddoAttr})
    const identityWallet = IdentityWallet
      .create({privateIdentityKey: args.privateIdentityKey, identity})
    await this.commit({wallet: identityWallet, privateEthereumKey})

    return identityWallet
  }

  public async commit({ wallet, privateEthereumKey }: IRegistryCommitArgs): Promise<void> {
    const ddo = wallet.getIdentity().didDocument
    this.unpin(ddo.getDID())

    let ipfsHash
    try {
      ipfsHash = await this.ipfsConnector.storeJSON({data: ddo, pin: true})
    } catch (error) {
      throw new Error(`Could not save DID record on IPFS. ${error.message}`)
    }

    try {
      await this.ethereumConnector.updateDIDRecord({
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
      const ddo = await this.ipfsConnector.catJSON(hash) as IDidDocumentAttrs
      const service =  DidDocument.fromJSON(ddo).getServiceEndpoints()
      const profile = service.map((endpoint) => (endpoint.type === 'PublicProfile') && endpoint)
      const publicProfile = await this.resolveServiceEndpoint(profile)

      const identity = Identity.create({ didDocument: ddo })

      return identity
    } catch (error) {
      throw new Error(`Could not retrieve DID Document. ${error.message}`)
    }
  }

  public async resolveServiceEndpoint(endpointSection: IServiceEndpointSectionAttrs): Promise<SignedCredential> {
    const ipfsHash = endpointSection.type.replace('ipfs://', '')
    const publicProfile =  await this.ipfsConnector.catJSON(ipfsHash) as ISignedCredentialAttrs
    return SignedCredential.fromJSON(publicProfile)
  }

  // public async authenticate(privateIdentityKey: Buffer): Promise<IdentityWallet> {
  //   const did = privateKeyToDID(privateIdentityKey)
  //   // TODO: change according to return of resolve
  //   const ddoAttrs = await this.resolve(did)
  //   const didDocument = DidDocument.fromJSON(ddoAttrs)

  //   const identityWallet = IdentityWallet.create({privateIdentityKey, identity: didDocument})

  //   return IdentityWallet.create({privateIdentityKey, identity})
  // }
}
