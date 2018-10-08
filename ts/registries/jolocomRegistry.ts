import { IIpfsConnector } from '../ipfs/types'
import { IEthereumConnector } from '../ethereum/types'
import { IdentityWallet } from '../identityWallet/identityWallet'
import { privateKeyToDID } from '../utils/crypto'
import { DidDocument } from '../identity/didDocument'
import { IDidDocumentAttrs } from '../identity/didDocument/types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'
import { Identity } from '../identity/identity'
import { IRegistryCommitArgs, IRegistryInstanceCreationArgs, IRegistryStaticCreationArgs } from './types'
import { jolocomIpfsStorageAgent } from '../ipfs'
import { jolocomEthereumResolver } from '../ethereum'
import { ServiceEndpointsSection } from '../identity/didDocument/sections'
import { IVerifiable } from './types'

/** Jolocom specific Registry, which uses IPFS
 *  and Ethereum for registering the indentity and the resolution
 *  mechanism.
 */
export class JolocomRegistry {
  public ipfsConnector: IIpfsConnector
  public ethereumConnector: IEthereumConnector

  public async create(args: IRegistryInstanceCreationArgs): Promise<IdentityWallet> {
    const { privateIdentityKey, privateEthereumKey } = args
    const ddo = await new DidDocument().fromPrivateKey(privateIdentityKey)

    const identity = Identity.create({ didDocument: ddo.toJSON() })
    const identityWallet = IdentityWallet.create({ privateIdentityKey: privateIdentityKey, identity })

    await this.commit({ wallet: identityWallet, privateEthereumKey })
    return identityWallet
  }

  public async commit({ wallet, privateEthereumKey }: IRegistryCommitArgs): Promise<void> {
    if (!privateEthereumKey) {
      privateEthereumKey = wallet.getIdentityKey().key
    }

    const ddo = wallet.getIdentity().didDocument
    const publicProfile = wallet.getIdentity().publicProfile.get()
    let publicProfileHash

    if (publicProfile) {
      publicProfileHash = await this.ipfsConnector.storeJSON({ data: publicProfile, pin: true })
      const pubProfEntry = {
        id: `${wallet.getIdentity().getDID()};jolocomPubProfile`,
        type: 'JolocomPublicProfile',
        description: 'Verifiable Credential describing entity profile',
        serviceEndpoint: `ipfs://${publicProfileHash}`
      }

      ddo.addServiceEndpoint(ServiceEndpointsSection.fromJSON(pubProfEntry))
    }

    let ipfsHash
    try {
      ipfsHash = await this.ipfsConnector.storeJSON({ data: ddo.toJSON(), pin: true })
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
      return
    }
  }

  public async resolve(did): Promise<Identity> {
    try {
      const ddoHash = await this.ethereumConnector.resolveDID(did)
      const ddo = (await this.ipfsConnector.catJSON(ddoHash)) as IDidDocumentAttrs
      const identityData = {
        didDocument: ddo,
        profile: undefined
      }

      const publicProfileSection = DidDocument.fromJSON(ddo)
        .getServiceEndpoints()
        .find(endpoint => endpoint.getType() === 'JolocomPublicProfile')

      if (publicProfileSection) {
        identityData.profile = await this.fetchPublicProfile(publicProfileSection.getServiceEndpoint())
      }

      return Identity.create(identityData)
    } catch (error) {
      throw new Error(`Could not retrieve DID Document. ${error.message}`)
    }
  }

  public async fetchPublicProfile(entry: string): Promise<SignedCredential> {
    const hash = entry.replace('ipfs://', '')
    const publicProfile = (await this.ipfsConnector.catJSON(hash)) as ISignedCredentialAttrs

    return SignedCredential.fromJSON(publicProfile)
  }

  public async authenticate(privateIdentityKey: Buffer): Promise<IdentityWallet> {
    const did = privateKeyToDID(privateIdentityKey)
    const identity = await this.resolve(did)

    return IdentityWallet.create({ privateIdentityKey, identity })
  }

  public async validateSignature(obj: IVerifiable): Promise<boolean> {
    const { did, keyId } = obj.getSigner()
    let pubKey
    
    try {
      const identity = await this.resolve(did)
      pubKey = identity.getPublicKeySection()
        .find(pubKeySection => pubKeySection.getIdentifier() === keyId)
    } catch (error) {
      throw new Error(`Could not validate signature with registry. ${error.message}`)
    }

    return obj
      .validateSignatureWithPublicKey(Buffer.from(pubKey.getPublicKeyHex(), 'hex'))
  }
}

export const createJolocomRegistry = (
  { ipfsConnector, ethereumConnector }: IRegistryStaticCreationArgs = {
    ipfsConnector: jolocomIpfsStorageAgent,
    ethereumConnector: jolocomEthereumResolver
  }
): JolocomRegistry => {
  const jolocomRegistry = new JolocomRegistry()
  jolocomRegistry.ipfsConnector = ipfsConnector
  jolocomRegistry.ethereumConnector = ethereumConnector

  return jolocomRegistry
}
