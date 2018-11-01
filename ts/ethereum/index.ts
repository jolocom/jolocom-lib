import EthereumResolver from 'jolocom-registry-contract'
import { IEthereumResolverConfig, IEthereumConnector, IEthereumResolverUpdateDIDArgs } from './types'

/* Class encapsulating methods for interacting with the registry smart contract */

export class EthResolver implements IEthereumConnector {
  private ethResolver: EthereumResolver

  /*
   * @constructor
   * @param config - Ethereum endpoint and registry address
   * @param config.providerUrl - Ethereum gateway http endpoint
   * @param config.contractAddress - Ethereum address at which the registry contract is deployed
   * @returns {Object} - Instance of configured registry
   */

  constructor(config: IEthereumResolverConfig) {
    this.ethResolver = new EthereumResolver(config.contractAddress, config.providerUrl)
  }

  /*
   * @description - Uses the Ethereum gateway to get the ipfs hash associated with the did
   *   from the contract
   * @param did - Did to resolve
   * @returns {Promise<string>} - Did document IPFS hash
   */

  public async resolveDID(did: string): Promise<string> {
    return this.ethResolver.resolveDID(did)
  }

  /*
   * @description - Uses the Ethereum gateway to update the ipfs hash associated with the did
   *   in the contract
   * @param ethereumKey - Ethereum private key to sign the transaction
   * @param did - Did to update
   * @param newHash - New IPFS hash to associate with the did
   * @returns {Promise<void>}
   */

  public async updateDIDRecord({ ethereumKey, did, newHash }: IEthereumResolverUpdateDIDArgs): Promise<void> {
    await this.ethResolver.updateDIDRecord(ethereumKey, did, newHash)
  }
}

/* Instantiates a resolver using the default configuration */

export const jolocomEthereumResolver = new EthResolver({
  providerUrl: 'https://rinkeby.infura.io/',
  contractAddress: '0xd4351c3f383d79ba378ed1875275b1e7b960f120'
})
