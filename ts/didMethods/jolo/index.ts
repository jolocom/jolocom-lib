import { IDidMethod, Resolver, Registrar } from "../types"
import { JolocomResolver } from "./resolver"
import { JolocomRegistrar } from "./registrar"
import { IVaultedKeyProvider } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider"
import { IdentityWallet } from "../../identityWallet/identityWallet"
import { createJoloIdentity, authJoloIdentity } from "./utils"
import { PROVIDER_URL, CONTRACT_ADDRESS, IPFS_ENDPOINT } from "./constants"


export class JoloDidMethod implements IDidMethod {
  public prefix: 'jolo'
  public resolver: Resolver
  public registrar: Registrar

  constructor(
    providerUrl = PROVIDER_URL,
    contractAddress = CONTRACT_ADDRESS,
    ipfsHost = IPFS_ENDPOINT
  ) {
    this.resolver = new JolocomResolver(providerUrl, contractAddress, ipfsHost)
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
    return createJoloIdentity(vaultedKeyProvider, decryptionPassword, this.registrar)
  }

  /**
   * Resolves a jolocom did and returns an {@link Identity} class instance
   * @param did - The jolocom did to resolve
   * @example `const serviceIdentity = await registry.resolve('did:jolo:...')`
   */

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
    password: string,
  ): Promise<IdentityWallet> {
    return authJoloIdentity(vaultedKeyProvider, password, this.resolver)
  }
}

