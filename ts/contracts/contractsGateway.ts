import {ethers} from 'ethers'
import {JsonRpcProvider} from 'ethers/providers'
import {IContractsGateway} from './types'

/**
 * @class
 * Class abstracting communication with smart contract enabled blockchain, in this case Ethereum
 * @internal
 */

export class ContractsGateway implements IContractsGateway {
  private provider: JsonRpcProvider


  /**
   * @constructor
   * @param providerUrl - JSON RPC endpoint for broadcasting transactions
   */

  constructor(providerUrl: string) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
  }

  /**
   * Get details about the used network
   * @example `ethGateway.getNetworkInfo()` // {name: 'rinkeby', chainId: 4, endpoint: 'https://rinkeby.infura.io'}
   */

  public getNetworkInfo() {
    return {
      name: this.provider.network.name,
      chainId: this.provider.network.chainId,
      endpoint: this.provider.connection.url
    }
  }

  /**
   * Query the chain for info about an address
   * @example `ethGateway.getAddressInfo('0xabc...def')` // { nonce: 5, balance: BigNumber { _hex: '0x301...'} }
   */

  public async getAddressInfo(address: string) {
    return {
      balance: await this.provider.getBalance(address),
      nonce: await this.provider.getTransactionCount(address)
    }
  }

  /**
   * Broadcast a signed / serialized transaction to the chain, and return the TX Hash
   * @example `ethGateway.broadcast('0xabc...def')` // '0xabcdef....'
   */

  public async broadcastTransaction(serializedTx: string): Promise<string> {
    return this.provider.sendTransaction(serializedTx).then(({hash}) => hash)
  }
}

export const jolocomContractsGateway = new ContractsGateway('https://rinkeby.infura.io/')
