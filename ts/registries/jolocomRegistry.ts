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
    const identityWallet = IdentityWallet.create({privateIdentityKey: args.privateIdentityKey, identity: ddo})

    await this.commit({wallet: identityWallet, privateEthereumKey})

    return identityWallet
  }

  public async commit({ wallet, privateEthereumKey }: IRegistryCommitArgs): Promise<void> {
    const ddo = wallet.getIdentity()
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

  public async resolve(did): Promise<IDidDocumentAttrs> {
    // TODO: return an instance of Identity (which is extended DDO)
    try {
      const hash = await this.ethereumConnector.resolveDID(did)
      return await this.ipfsConnector.catJSON(hash) as Promise<IDidDocumentAttrs>
    } catch (error) {
      throw new Error(`Could not retrieve DID Document. ${error.message}`)
    }
  }

  public async authenticate(privateIdentityKey: Buffer): Promise<IdentityWallet> {
    const did = privateKeyToDID(privateIdentityKey)
    // TODO: change according to return of resolve
    const ddoAttrs = await this.resolve(did)
    const didDocument = DidDocument.fromJSON(ddoAttrs)

    const identityWallet = IdentityWallet.create({privateIdentityKey, identity: didDocument})

    return identityWallet
  }
}
