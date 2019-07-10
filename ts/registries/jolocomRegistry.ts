import { IIpfsConnector } from '../ipfs/types'
import { IEthereumConnector } from '../ethereum/types'
import { IdentityWallet } from '../identityWallet/identityWallet'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types'
import { Identity } from '../identity/identity'
import {
  IRegistry,
  IRegistryCommitArgs,
  IRegistryStaticCreationArgs,
} from './types'
import { jolocomIpfsStorageAgent } from '../ipfs/ipfs'
import { jolocomEthereumResolver } from '../ethereum/ethereum'
import { publicKeyToDID } from '../utils/crypto'
import {
  IKeyDerivationArgs,
  IVaultedKeyProvider,
  KeyTypes,
} from '../vaultedKeyProvider/types'
import { jolocomContractsAdapter } from '../contracts/contractsAdapter'
import { IContractsAdapter, IContractsGateway } from '../contracts/types'
import { jolocomContractsGateway } from '../contracts/contractsGateway'
import { PublicKey } from '../identity/types'
import { IServiceEndpointSectionAttrs } from '../identity/didDocument/sections/types'
import { keyNumberToKeyId } from '../utils/helper'
import { ServiceEndpointsSection } from '../identity/didDocument/sections'

/**
 * @class
 * Jolocom specific Registry. Uses IPFS and Ethereum for anchoring indentities and the resolution mechanism.
 */

export class JolocomRegistry implements IRegistry {
  public ipfsConnector: IIpfsConnector
  public ethereumConnector: IEthereumConnector
  public contractsAdapter: IContractsAdapter
  public contractsGateway: IContractsGateway

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
    const derivationArgs = {
      derivationPath: KeyTypes.jolocomIdentityKey,
      encryptionPass: decryptionPassword,
    }

    const publicIdentityKey = vaultedKeyProvider.getPublicKey(derivationArgs)
    const identity = Identity.create(publicIdentityKey)

    const identityWallet = new IdentityWallet({
      identity,
      vaultedKeyProvider,
      publicKeyMetadata: {
        derivationPath: KeyTypes.jolocomIdentityKey,
        keyId: keyNumberToKeyId(identity.publicKey.keyId, identity.did),
      },
      contractsAdapter: this.contractsAdapter,
      contractsGateway: this.contractsGateway,
    })
    identityWallet.identity.created = await this.commit({
      identityWallet,
      vaultedKeyProvider,
      keyMetadata: {
        encryptionPass: decryptionPassword,
        derivationPath: KeyTypes.jolocomIdentityKey,
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
   * @returns the date of the last update of the identity entry in the registry
   * @deprecated Will be modified in next major release to not require access to the vault
   * @example `await registry.commit({ vaultedKeyProvider, keyMetadata, identityWallet })`
   */

  public async commit(commitArgs: IRegistryCommitArgs): Promise<Date> {
    const { identityWallet, keyMetadata, vaultedKeyProvider } = commitArgs
    let serviceHash = ''
    try {
      if (identityWallet.identity.services)
        serviceHash = await this.ipfsConnector.storeJSON({
          data: identityWallet.identity.services.map(s => s.toJSON()),
          pin: true,
        })
      const privateKey = vaultedKeyProvider.getPrivateKey(keyMetadata)
      const owner = vaultedKeyProvider.getPublicKey(keyMetadata)

      return await this.ethereumConnector.updateDIDRecord({
        ethereumKey: privateKey,
        did: identityWallet.identity.did,
        owner: '0x' + owner.toString('hex'),
        newHash: serviceHash,
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
      const {
        owner,
        recovery,
        serviceHash,
      } = await this.ethereumConnector.resolveDID(did)
      const created = await this.ethereumConnector.getCreated(did)
      const updated = await this.ethereumConnector.getUpdated(did)

      if (!owner) {
        throw new Error('No record for DID found.')
      }
      let servicesJSON = serviceHash
        ? ((await this.ipfsConnector.catJSON(serviceHash)) as object[])
        : []
      const services = []
      servicesJSON.forEach((s: IServiceEndpointSectionAttrs) =>
        services.push(ServiceEndpointsSection.fromJSON(s)),
      )
      const ownerKey: PublicKey = {
        hexValue: owner.split('0x').pop(),
        keyId: 1,
      }
      const recoveryKey: PublicKey = {
        hexValue: recovery,
        keyId: 2,
      }
      return new Identity(
        did,
        ownerKey,
        recovery ? recoveryKey : null,
        services,
        created,
        updated,
      )
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
   * @example `const wallet = registry.authenticate(vault, { derivationPath: '...', encryptionPass: '...'})`
   */

  public async authenticate(
    vaultedKeyProvider: IVaultedKeyProvider,
    derivationArgs: IKeyDerivationArgs,
  ): Promise<IdentityWallet> {
    const publicIdentityKey = vaultedKeyProvider.getPublicKey(derivationArgs)

    const did = publicKeyToDID(publicIdentityKey)
    const identity = await this.resolve(did)

    const publicKeyMetadata = {
      derivationPath: derivationArgs.derivationPath,
      keyId: keyNumberToKeyId(identity.publicKey.keyId, identity.did),
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
   * Fetches the public profile signed credential form ipfs
   * @param entry - IPFS hash of public profile credential
   * @example `const pubProf = await registry.fetchPublicProfile('ipfs://Qm...')`
   * @internal
   */

  public async fetchPublicProfile(entry: string): Promise<SignedCredential> {
    const hash = entry.replace('ipfs://', '')
    const publicProfile = (await this.ipfsConnector.catJSON(
      hash,
    )) as ISignedCredentialAttrs

    return SignedCredential.fromJSON(publicProfile)
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

  return jolocomRegistry
}
