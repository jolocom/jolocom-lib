import { IIpfsConnector } from '../ipfs/types'
import { IEthereumConnector } from '../ethereum/types'
import { IdentityWallet } from '../identityWallet/identityWallet'
import { DidDocument } from '../identity/didDocument'
import { IDidDocumentAttrs } from '../identity/didDocument/types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'
import { Identity } from '../identity/identity'
import { IRegistryCommitArgs, IRegistryStaticCreationArgs } from './types'
import { jolocomIpfsStorageAgent } from '../ipfs'
import { jolocomEthereumResolver } from '../ethereum'
import { PublicProfileServiceEndpoint } from '../identity/didDocument/sections/serviceEndpointsSection'
import { publicKeyToDID } from '../utils/crypto'
import { IVaultedKeyProvider, IKeyDerivationArgs } from '../vaultedKeyProvider/softwareProvider'
import { KeyTypes } from '../vaultedKeyProvider/types'

/*
 * Jolocom specific Registry, which uses IPFS
 * and Ethereum for registering the indentity and the resolution
 * mechanism.
 */

export class JolocomRegistry {
  public ipfsConnector: IIpfsConnector
  public ethereumConnector: IEthereumConnector

  /*
   * @description - Registers a  new Jolocom identity on Ethereum and IPFS and returns
   *   an instance of the Identity Wallet class
   * @param vaultedKeyProvider - Instance of Vaulted Provider class storing password
   *  encrypted seed. Implementations that interface with secure hardware
   *  elements can be used too.
   * @param decryptionPassword - password used to decrypt seed in vault for key generation
  */

  public async create(vaultedKeyProvider: IVaultedKeyProvider, decryptionPassword: string): Promise<IdentityWallet> {
    const { jolocomIdentityKey, ethereumKey } = KeyTypes

    const publicIdentityKey = vaultedKeyProvider.getPublicKey({
      derivationPath: jolocomIdentityKey,
      encryptionPass: decryptionPassword
    })

    const didDocument = await DidDocument.fromPublicKey(publicIdentityKey)
    const identity = Identity.fromDidDocument({ didDocument })

    const identityWallet = new IdentityWallet({
      identity,
      vaultedKeyProvider,
      publicKeyMetadata: {
        derivationPath: jolocomIdentityKey,
        keyId: didDocument.getPublicKeySections()[0].getIdentifier()
      }
    })

    await this.commit({
      identityWallet,
      vaultedKeyProvider,
      keyMetadata: {
        encryptionPass: decryptionPassword,
        derivationPath: ethereumKey
      }
    })

    return identityWallet
  }

  /*
   * @description - Stores the passed didDocument / public profile on IPFS
   *   and updates the mapping in the smart contract. Currently requires access
   *   to the user's private key, which is an antipattern, will be deprecated.
   * @param commitArgs - Data to be commited and vault to get private keys
   * @param commitargs.vaultedKeyProvider - Vaulted key store
   * @param commitargs.keyMetadata - Derivation path and decryption pass
   * @param commitargs.identityWallet - Wallet containing did document and public profile
   * @return { void }
  */
  
  public async commit(commitArgs: IRegistryCommitArgs) {
    const { identityWallet, keyMetadata, vaultedKeyProvider } = commitArgs

    const didDocument = identityWallet.getDidDocument()
    const publicProfile = identityWallet.getIdentity().publicProfile.get()

    if (publicProfile) {
      const publicProfileHash = await this.ipfsConnector.storeJSON({ data: publicProfile, pin: true })
      const publicProfileSection = PublicProfileServiceEndpoint.create(identityWallet.getDid(), publicProfileHash)
      didDocument.addServiceEndpoint(publicProfileSection)
    }

    try {
      const ipfsHash = await this.ipfsConnector.storeJSON({ data: didDocument.toJSON(), pin: true })
      const privateEthKey = vaultedKeyProvider.getPrivateKey(keyMetadata)

      await this.ethereumConnector.updateDIDRecord({
        ethereumKey: privateEthKey,
        did: didDocument.getDid(),
        newHash: ipfsHash
      })
    } catch (error) {
      throw new Error(`Error occured while persisting identity data: ${error.message}`)
    }
  }

  /*
   * @description - Resolves a jolocom did and returns an Identity class instance
   * @param did - The jolocom did to resolve
   * @return { Object } - Instance of Identity class containing did document and public profile
  */

  public async resolve(did): Promise<Identity> {
    try {
      const ddoHash = await this.ethereumConnector.resolveDID(did)
      const didDocument = DidDocument.fromJSON((await this.ipfsConnector.catJSON(ddoHash)) as IDidDocumentAttrs)

      const publicProfileSection = didDocument
        .getServiceEndpointSections()
        .find(endpoint => endpoint.getType() === 'JolocomPublicProfile')

      const publicProfile = publicProfileSection && (await this.fetchPublicProfile(publicProfileSection.getEndpoint()))

      return Identity.fromDidDocument({
        didDocument,
        publicProfile
      })
    } catch (error) {
      throw new Error(`Could not retrieve DID Document. ${error.message}`)
    }
  }

  /*
   * @description - Derives the identity public key, fetches the public
   *   profile and did document, and instantiates an identity wallet
   *   with the vault, decryption pass, and and key metadata
   * @param vaultedKeyProvider - Vaulted key store
   * @param derivationArgs - password for the vault and derivation path
   * @return { Object } - Instance of Identity class containing did document and public profile
  */

  public async authenticate(vaultedKeyProvider: IVaultedKeyProvider, derivationArgs: IKeyDerivationArgs): Promise<IdentityWallet> {
    const publicIdentityKey = vaultedKeyProvider.getPublicKey(derivationArgs)
    const did = publicKeyToDID(publicIdentityKey)
    const identity = await this.resolve(did)

    const publicKeyMetadata = {
      derivationPath: derivationArgs.derivationPath,
      keyId: identity.getPublicKeySection()[0].getIdentifier()
    }

    return new IdentityWallet({
      vaultedKeyProvider,
      identity,
      publicKeyMetadata
    })
  }

  /*
   * @description - Fetches the public profile signed credential form ipfs
   * @param entry - Service endpoint, e.g. ipfs://Qm....
   * @return { Object } - Instance of Identity class containing did document and public profile
  */

  public async fetchPublicProfile(entry: string): Promise<SignedCredential> {
    const hash = entry.replace('ipfs://', '')
    const publicProfile = (await this.ipfsConnector.catJSON(hash)) as ISignedCredentialAttrs

    return SignedCredential.fromJSON(publicProfile)
  }

  private async unpin(did): Promise<void> {
    try {
      const hash = await this.ethereumConnector.resolveDID(did)
      await this.ipfsConnector.removePinnedHash(hash)
    } catch (err) {
      return
    }
  }

  // public async validateSignature(obj: IVerifiable): Promise<boolean> {
  //   const { did, keyId } = obj.getSigner()
  //   let pubKey

  //   try {
  //     const identity = await this.resolve(did)
  //     pubKey = identity.getPublicKeySection().find(pubKeySection => pubKeySection.getIdentifier() === keyId)

  //     if (!pubKey) {
  //       return false
  //     }
  //   } catch (error) {
  //     throw new Error(`Could not validate signature with registry. ${error.message}`)
  //   }

  //   return obj.validateSignatureWithPublicKey(Buffer.from(pubKey.getPublicKeyHex(), 'hex'))
  // }
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
