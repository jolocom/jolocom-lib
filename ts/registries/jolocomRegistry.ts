import { IIpfsConnector } from '../ipfs/types'
import { IEthereumConnector } from '../ethereum/types'
import { IdentityWallet } from '../identityWallet/identityWallet'
import { DidDocument } from '../identity/didDocument/didDocument'
import { IDidDocumentAttrs } from '../identity/didDocument/types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'
import { Identity } from '../identity/identity'
import { IRegistryCommitArgs, IRegistryStaticCreationArgs } from './types'
import { jolocomIpfsStorageAgent } from '../ipfs/ipfs'
import { jolocomEthereumResolver } from '../ethereum/ethereum'
import { publicKeyToDID } from '../utils/crypto'
import { IVaultedKeyProvider, IKeyDerivationArgs } from '../vaultedKeyProvider/softwareProvider'
import { KeyTypes } from '../vaultedKeyProvider/types'
import { generatePublicProfileServiceSection } from '../identity/didDocument/sections/serviceEndpointsSection';

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
    const derivationArgs = {
      derivationPath: jolocomIdentityKey,
      encryptionPass: decryptionPassword
    }

    const publicIdentityKey = vaultedKeyProvider.getPublicKey(derivationArgs)

    const didDocument = await DidDocument.fromPublicKey(publicIdentityKey)
    const didDocumentSignature = await vaultedKeyProvider.signDigestable(derivationArgs, didDocument)

    didDocument.signatureValue = didDocumentSignature.toString('hex')
    const identity = Identity.fromDidDocument({ didDocument })

    const identityWallet = new IdentityWallet({
      identity,
      vaultedKeyProvider,
      publicKeyMetadata: {
        derivationPath: jolocomIdentityKey,
        keyId: didDocument.publicKey[0].id
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

    const didDocument = identityWallet.didDocument
    const publicProfile = identityWallet.identity.publicProfile

    const remote = await this.resolveSafe(didDocument.did)
    const remotePubProf = remote && remote.publicProfile

    try {
      if (publicProfile) {
        const publicProfileHash = await this.ipfsConnector.storeJSON({ data: publicProfile.toJSON(), pin: true })
        const publicProfileSection = generatePublicProfileServiceSection(didDocument.did, publicProfileHash)
        didDocument.addServiceEndpoint(publicProfileSection)
      }

      if (remotePubProf && !publicProfile) {
        didDocument.resetServiceEndpoints()
      }

      const ipfsHash = await this.ipfsConnector.storeJSON({ data: didDocument.toJSON(), pin: true })
      const privateEthKey = vaultedKeyProvider.getPrivateKey(keyMetadata)

      await this.ethereumConnector.updateDIDRecord({
        ethereumKey: privateEthKey,
        did: didDocument.did,
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

      if (!ddoHash) {
        throw new Error('No record for DID found.')
      }

      const didDocument = DidDocument.fromJSON((await this.ipfsConnector.catJSON(ddoHash)) as IDidDocumentAttrs)

      const publicProfileSection = didDocument
        .service
        .find(endpoint => endpoint.type === 'JolocomPublicProfile')

      const publicProfile = publicProfileSection && (await this.fetchPublicProfile(publicProfileSection.serviceEndpoint))

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

  public async authenticate(
    vaultedKeyProvider: IVaultedKeyProvider,
    derivationArgs: IKeyDerivationArgs
  ): Promise<IdentityWallet> {
    const publicIdentityKey = vaultedKeyProvider.getPublicKey(derivationArgs)
    const did = publicKeyToDID(publicIdentityKey)
    const identity = await this.resolve(did)

    const publicKeyMetadata = {
      derivationPath: derivationArgs.derivationPath,
      keyId: identity.publicKeySection[0].id
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

  /*
   * @description - Proxies to this.resolve, but catches error and returns undefined
   * @param did - The jolocom did to resolve
   * @return { Object } - Instance of Identity class containing did document and public profile, or undefined
  */

  private async resolveSafe(did: string): Promise<Identity> {
    try {
      return await this.resolve(did)
    } catch {
      return
    }
  }
}

/*
   * @description - Returns a instance of the Jolocom registry given connector, defaults to
   *   Jolocom defined connectors.
   * @param ipfsConnector - Instance of class implementing the IIpfsConnector interface
   * @param ethereumConnector - Instance of class implementing the IEthereumConnector interface
   * @return { Object } - Instantiated registry
  */

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
