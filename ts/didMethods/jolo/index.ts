import { IDidMethod, IResolver, IRegistrar } from "../types"
import { JolocomResolver } from "./resolver"
import { JolocomRegistrar } from "./registrar"
import { PROVIDER_URL, CONTRACT_ADDRESS, IPFS_ENDPOINT } from "./constants"

export class JoloDidMethod implements IDidMethod {
  public prefix: 'jolo'
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
}

