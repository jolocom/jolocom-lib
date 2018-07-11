import EthereumResolver from 'jolocom-registry-contract'
import {
  IEthereumResolverConfig,
  IEthereumConnector,
  IEthereumResolverUpdateDIDArgs
} from './types'

export class EthResolver implements IEthereumConnector {
  private ethResolver: any

  constructor(config: IEthereumResolverConfig) {
    this.ethResolver = new EthereumResolver(config.contractAddress, config.providerUrl)
  }

  public async resolveDID(did: string): Promise<string> {
    return this.ethResolver.resolveDID(did)
  }

  public async updateDIDRecord({ ethereumKey, did, newHash }: IEthereumResolverUpdateDIDArgs): Promise<void> {
    return this.ethResolver.updateDIDRecord(ethereumKey, did, newHash)
  }
}

export const jolocomEthereumResolver = new EthResolver(
  {
    providerUrl: 'https://rinkeby.infura.io/',
    contractAddress: '0xd4351c3f383d79ba378ed1875275b1e7b960f120'
  }
)
