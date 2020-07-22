import { IdentityWallet } from '../identityWallet/identityWallet'
import { DidDocument } from '../identity/didDocument/didDocument'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { Identity } from '../identity/identity'
import {
  IRegistry,
} from './types'
import { publicKeyToDID } from '../utils/crypto'
import {
  IVaultedKeyProvider,
} from '../vaultedKeyProvider/types'
import { KeyTypes } from '../vaultedKeyProvider/types'
import { jolocomContractsAdapter } from '../contracts/contractsAdapter'
import { jolocomContractsGateway } from '../contracts/contractsGateway'
import { Resolver } from 'did-resolver'
import { getPublicProfile, getResolver } from 'jolo-did-resolver'
import { ErrorCodes } from '../errors'
import { convertDidDocToIDidDocumentAttrs } from '../utils/resolution'
import { digestJsonLd } from '../linkedData'
import { getIssuerPublicKey } from '../utils/helper'
import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { JolocomRegistrar } from '../registrars/jolocomRegistrar'
import { Registrar } from '../registrars/types'

export class JolocomRegistry implements IRegistry {
  public resolver: Resolver
  public registrar: Registrar<Identity, {}> // TODO Are these generics useful?

  constructor(providerUrl?: string, contractAddress?: string, ipfsHost?: string) {
    this.resolver = new Resolver(getResolver(providerUrl, contractAddress, ipfsHost))
    this.registrar = new JolocomRegistrar(providerUrl, contractAddress, ipfsHost)
  }

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
    const identity = await this.registrar.create(
      vaultedKeyProvider,
      decryptionPassword
    )

    return new IdentityWallet({
      identity,
      vaultedKeyProvider,
      publicKeyMetadata: {
        derivationPath: KeyTypes.jolocomIdentityKey,
        keyId: identity.didDocument.signer.keyId,
      },
      contractsAdapter: jolocomContractsAdapter,
      contractsGateway: jolocomContractsGateway,
    })
  }

  /**
   * Resolves a jolocom did and returns an {@link Identity} class instance
   * @param did - The jolocom did to resolve
   * @example `const serviceIdentity = await registry.resolve('did:jolo:...')`
   */

  public async resolve(did: string): Promise<Identity> {
    const jsonDidDoc = await this.resolver.resolve(did)
      .catch(_ => {
        throw new Error(ErrorCodes.RegistryDIDNotAnchored)
      })

    const publicProfileJson = await getPublicProfile(jsonDidDoc)

    const didDocument = DidDocument.fromJSON(
      convertDidDocToIDidDocumentAttrs(jsonDidDoc)
    )

    const signatureValid = SoftwareKeyProvider.verify(
      //@ts-ignore TODO Handle this
      await digestJsonLd(jsonDidDoc, jsonDidDoc['@context']),
      getIssuerPublicKey(didDocument.signer.keyId, didDocument),
      Buffer.from(didDocument.proof.signature, 'hex')
    )

    if (!signatureValid) {
      throw new Error(ErrorCodes.InvalidSignature)
    }

    // TODO Verify signature on public profile

    return Identity.fromDidDocument({
      didDocument,
      publicProfile: publicProfileJson &&
        SignedCredential.fromJSON(publicProfileJson)
    })
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
    password: string,
  ): Promise<IdentityWallet> {
    const publicIdentityKey = vaultedKeyProvider.getPublicKey({
      derivationPath: KeyTypes.jolocomIdentityKey,
      encryptionPass: password
    })

    const identity = await this.resolve(
      publicKeyToDID(publicIdentityKey)
    )

    const publicKeyMetadata = {
      derivationPath: KeyTypes.jolocomIdentityKey,
      keyId: identity.didDocument.signer.keyId,
    }

    return new IdentityWallet({
      vaultedKeyProvider,
      identity,
      publicKeyMetadata,
      contractsGateway: jolocomContractsGateway,
      contractsAdapter: jolocomContractsAdapter,
    })
  }
}

export const jolocomResolver = () => new Resolver(getResolver())

/**
 * Returns a instance of the Jolocom registry given connector, defaults to Jolocom defined connectors.
 * @param configuration - Connectors required for smart contract, storage, and anchoring interactions
 * @param configuration.ipfsConnector - Instance of class implementing the {@link IIpfsConnector} interface
 * @param configuration.ethereumConnector - Instance of class implementing the {@link IEthereumConnector} interface
 * @param configuration.contracts - Classes for interacting with Smart ContractsAdapter, implementing {@link IContractsGateway} and {@link IContractsAdapter}
 * @param configuration.resolver - Classes for resolving did documents
 * @example `const registry = createJolocomRegistry()`
 */

export const jolocomRegistry = new JolocomRegistry()
