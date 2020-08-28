import { IDidMethod, IResolver, IRegistrar } from "../types"
import { JolocomResolver } from "./resolver"
import { JolocomRegistrar } from "./registrar"
import { PROVIDER_URL, CONTRACT_ADDRESS, IPFS_ENDPOINT } from "./constants"
import { recoverJoloKeyProviderFromSeed } from "./recovery"
import { walletUtils } from "@jolocom/native-core"
import { authAsIdentityFromKeyProvider } from "../utils"

export class JoloDidMethod implements IDidMethod {
  public prefix = 'jolo'
  public resolver: IResolver
  public registrar: IRegistrar

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
    return authAsIdentityFromKeyProvider(keyProvider, newPassword, this.resolver)
  }
}

