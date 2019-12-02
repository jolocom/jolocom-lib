import { IIpfsConnector } from '../ipfs/types'
import { IEthereumConnector } from '../ethereum/types'
import { IdentityWallet } from '../identityWallet/identityWallet'
import { DidDocument } from '../identity/didDocument/didDocument'
import { IDidDocumentAttrs } from '../identity/didDocument/types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'
import { Identity } from '../identity/identity'
import {
  IRegistryCommitArgs,
  IRegistryStaticCreationArgs,
  IRegistry,
} from './types'
import { jolocomIpfsStorageAgent } from '../ipfs/ipfs'
import { jolocomEthereumResolver } from '../ethereum/ethereum'
import { publicKeyToDID } from '../utils/crypto'
import {
  IVaultedKeyProvider,
  IKeyDerivationArgs,
} from '../vaultedKeyProvider/types'
import { KeyTypes } from '../vaultedKeyProvider/types'
import { generatePublicProfileServiceSection } from '../identity/didDocument/sections/serviceEndpointsSection'
import { jolocomContractsAdapter } from '../contracts/contractsAdapter'
import { IContractsAdapter, IContractsGateway } from '../contracts/types'
import { jolocomContractsGateway } from '../contracts/contractsGateway'
import { Resolver } from 'did-resolver'
import { getPublicProfile, getResolver } from 'jolo-did-resolver'

/**
 * @class
 * Jolocom specific Registry. Uses IPFS and Ethereum for anchoring indentities and the resolution mechanism.
 */

export class JolocomRegistry implements IRegistry {
  public ipfsConnector: IIpfsConnector
  public ethereumConnector: IEthereumConnector
  public contractsAdapter: IContractsAdapter
  public contractsGateway: IContractsGateway
  public resolver: Resolver

  /**
   * Registers a  new Jolocom identity on Ethereum and IPFS and returns an instance of the Identity Wallet class
   * @param vaultedKeyProvider - Instance of Vaulted Provider class storing password encrypted seed.
   * @param decryptionPassword - password used to decrypt seed in vault for key generation
   * @example `const identityWallet = await registry.create(vaultedProvider, 'password')`
   */

  public async create(
    vaultedKeyProvider: IVaultedKeyProvider,
    decryptionPassword: string,
  ): Promise<IdentityWallet> {
    const { jolocomIdentityKey, ethereumKey } = KeyTypes

    const derivationArgs = {
      derivationPath: jolocomIdentityKey,
      encryptionPass: decryptionPassword,
    }

    const publicIdentityKey = vaultedKeyProvider.getPublicKey(derivationArgs)

    const didDocument = await DidDocument.fromPublicKey(publicIdentityKey)
    const didDocumentSignature = await vaultedKeyProvider.signDigestable(
      derivationArgs,
      didDocument,
    )

    didDocument.signature = didDocumentSignature.toString('hex')
    const identity = Identity.fromDidDocument({ didDocument })

    const identityWallet = new IdentityWallet({
      identity,
      vaultedKeyProvider,
      publicKeyMetadata: {
        derivationPath: jolocomIdentityKey,
        keyId: didDocument.publicKey[0].id,
      },
      contractsAdapter: this.contractsAdapter,
      contractsGateway: this.contractsGateway,
    })

    await this.commit({
      identityWallet,
      vaultedKeyProvider,
      keyMetadata: {
        encryptionPass: decryptionPassword,
        derivationPath: ethereumKey,
      },
    })

    return identityWallet
  }

  /**
   * Stores the passed didDocument / public profile on IPFS and updates the mapping in the smart contract.
   * @param commitArgs - Data to be committed and vault to get private keys
   * @param commitArgs.vaultedKeyProvider - Vaulted key store
   * @param commitArgs.keyMetadata - Derivation path and decryption pass
   * @param commitArgs.identityWallet - Wallet containing did document and public profile
   * @deprecated Will be modified in next major release to not require access to the vault
   * @example `await registry.commit({ vaultedKeyProvider, keyMetadata, identityWallet })`
   */

  public async commit(commitArgs: IRegistryCommitArgs) {
    const { identityWallet, keyMetadata, vaultedKeyProvider } = commitArgs

    const didDocument = identityWallet.didDocument
    const publicProfile = identityWallet.identity.publicProfile

    const remote = await this.resolveSafe(didDocument.did)
    const remotePubProf = remote && remote.publicProfile

    try {
      if (publicProfile) {
        const publicProfileHash = await this.ipfsConnector.storeJSON({
          data: publicProfile.toJSON(),
          pin: true,
        })
        const publicProfileSection = generatePublicProfileServiceSection(
          didDocument.did,
          publicProfileHash,
        )
        didDocument.addServiceEndpoint(publicProfileSection)
      }

      if (remotePubProf && !publicProfile) {
        didDocument.resetServiceEndpoints()
      }

      const ipfsHash = await this.ipfsConnector.storeJSON({
        data: didDocument.toJSON(),
        pin: true,
      })
      const privateEthKey = vaultedKeyProvider.getPrivateKey(keyMetadata)

      await this.ethereumConnector.updateDIDRecord({
        ethereumKey: privateEthKey,
        did: didDocument.did,
        newHash: ipfsHash,
      })
    } catch (error) {
      throw new Error(
        `Error occured while persisting identity data: ${error.message}`,
      )
    }
  }

  /**
   * Resolves a jolocom did and returns an {@link Identity} class instance
   * @param did - The jolocom did to resolve
   * @example `const serviceIdentity = await registry.resolve('did:jolo:...')`
   */

  public async resolve(did): Promise<Identity> {
    try {
      const jsonDidDoc = await this.resolver.resolve(did)
      if (!jsonDidDoc) {
        throw new Error('No record for DID found.')
      }

      // @ts-ignore
      const didDocument = DidDocument.fromJSON(jsonDidDoc)
      const publicProfile = (await getPublicProfile(
        jsonDidDoc,
      )) as SignedCredential

      return Identity.fromDidDocument({
        didDocument,
        publicProfile,
      })
    } catch (error) {
      throw new Error(`Could not retrieve DID Document. ${error.message}`)
    }
  }

  /**
   * Derives the identity public key, fetches the public
   *   profile and did document, and instantiates an identity wallet
   *   with the vault, decryption pass, and and key metadata
   * @param vaultedKeyProvider - Vaulted key store
   * @param derivationArgs - password for the vault and derivation path
   * @param did - [optional] DID that should be resolved. If not provided the DID will be generated based on the public key
   * @example `const wallet = registry.authenticate(vault, { derivationPath: '...', encryptionPass: '...'})`
   */

  public async authenticate(
    vaultedKeyProvider: IVaultedKeyProvider,
    derivationArgs: IKeyDerivationArgs,
    did?: string,
  ): Promise<IdentityWallet> {
    const publicIdentityKey = vaultedKeyProvider.getPublicKey(derivationArgs)
    did = did ? did : publicKeyToDID(publicIdentityKey)
    const identity = await this.resolve(did)

    const publicKeyMetadata = {
      derivationPath: derivationArgs.derivationPath,
      keyId: identity.publicKeySection[0].id,
    }

    return new IdentityWallet({
      vaultedKeyProvider,
      identity,
      publicKeyMetadata,
      contractsGateway: this.contractsGateway,
      contractsAdapter: this.contractsAdapter,
    })
  }

  /**
   * Proxies to this.resolve, but catches error and returns undefined
   * @param did - The jolocom did to resolve
   * @example `const serviceIdentity = await registry.resolveSafe('did:jolo:...')`
   * @internal
   */

  private async resolveSafe(did: string): Promise<Identity> {
    try {
      return await this.resolve(did)
    } catch {
      return
    }
  }
}

/**
 * Returns a instance of the Jolocom registry given connector, defaults to Jolocom defined connectors.
 * @param configuration - Connectors required for smart contract, storage, and anchoring interactions
 * @param configuration.ipfsConnector - Instance of class implementing the {@link IIpfsConnector} interface
 * @param configuration.ethereumConnector - Instance of class implementing the {@link IEthereumConnector} interface
 * @param configuration.contracts - Classes for interacting with Smart ContractsAdapter, implementing {@link IContractsGateway} and {@link IContractsAdapter}
 * @example `const registry = createJolocomRegistry()`
 */

export const createJolocomRegistry = (
  configuration: IRegistryStaticCreationArgs = {
    ipfsConnector: jolocomIpfsStorageAgent,
    ethereumConnector: jolocomEthereumResolver,
    contracts: {
      adapter: jolocomContractsAdapter,
      gateway: jolocomContractsGateway,
    },
  },
): JolocomRegistry => {
  const { ipfsConnector, contracts, ethereumConnector } = configuration
  const jolocomRegistry = new JolocomRegistry()

  jolocomRegistry.ipfsConnector = ipfsConnector
  jolocomRegistry.ethereumConnector = ethereumConnector
  jolocomRegistry.contractsAdapter = contracts.adapter
  jolocomRegistry.contractsGateway = contracts.gateway
  jolocomRegistry.resolver = new Resolver(getResolver())

  return jolocomRegistry
}

export const jolocomResolver = (additionalResolver?: {}): Resolver => {
  const jolo = getResolver()
  return new Resolver({ ...additionalResolver, ...jolo })
}
