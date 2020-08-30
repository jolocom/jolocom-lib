import { IDidMethod } from "../types"
import { JolocomResolver } from "./resolver"
import { JolocomRegistrar } from "./registrar"
import { PROVIDER_URL, CONTRACT_ADDRESS, IPFS_ENDPOINT } from "./constants"
import { recoverJoloKeyProviderFromSeed } from "./recovery"
import { walletUtils } from "@jolocom/native-core"
import { authAsIdentityFromKeyProvider } from "../utils"

export class JoloDidMethod implements IDidMethod {
  public prefix = 'jolo'
  public resolver: JolocomResolver
  public registrar: JolocomRegistrar

  constructor(
    providerUrl = PROVIDER_URL,
    contractAddress = CONTRACT_ADDRESS,
    ipfsHost = IPFS_ENDPOINT
  ) {
    this.resolver = new JolocomResolver(providerUrl, contractAddress, ipfsHost)
    this.registrar = new JolocomRegistrar(providerUrl, contractAddress, ipfsHost)
  }

  public async recoverFromSeed(seed: Buffer, newPassword: string) {
    const keyProvider = await recoverJoloKeyProviderFromSeed(seed, newPassword, walletUtils)
    try {
      return {
        identityWallet: await authAsIdentityFromKeyProvider(
          keyProvider,
          newPassword,
          this.resolver
        ),
        succesfullyResolved: true
      }
    } catch (e) {
      return {
        identityWallet: await authAsIdentityFromKeyProvider(
          keyProvider,
          newPassword,
          await this.registrar.didDocumentFromKeyProvider(keyProvider, newPassword),
        ),
        succesfullyResolved: false
      }
    }
  }
}
