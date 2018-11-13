import EthereumResolver from 'jolocom-registry-contract'
import { IEthereumResolverConfig, IEthereumConnector, IEthereumResolverUpdateDIDArgs } from './types'

/**
 * @class
 * Class abstracting all interactions with the registry smart contract
 */

export class EthResolver implements IEthereumConnector {
  private ethResolver: EthereumResolver

  /**
   * @constructor
   * @param config - Configuration to connect to a remote Ethereum node, and the address of the registry contract
   * @param config.providerUrl - Endpoint to connect to an Ethereum http api gateway, e.g. infura
   * @param config.contractAddress - The address of the Jolocom registry smart contract
   * @returns {EthereumResolver} - Instance of configured registry
   */

  constructor(config: IEthereumResolverConfig) {
    this.ethResolver = new EthereumResolver(config.contractAddress, config.providerUrl)
  }

  /**
   * @todo - This should throw an error, or return false in case no record is found
   * @description - Returns a reference to the did document given the did or an empty string
   * @param did - Did to resolve
   * @returns {Promise<string>} - IPFS hash of the did document
   */

  public async resolveDID(did: string): Promise<string> {
    return this.ethResolver.resolveDID(did)
  }

  /**
   * @description - Updates the mapping in the smart contract to reference a new pointer
   * @deprecated - Will be deprecated in next major release to avoid relying on private keys in the codebase
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
