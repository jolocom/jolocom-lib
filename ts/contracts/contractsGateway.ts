import {ethers} from 'ethers'
import {JsonRpcProvider, Web3Provider} from 'ethers/providers'
import {IContractsGateway} from './types'

/**
 * @class
 * Class abstracting communication with smart contract enabled blockchain, in this case Ethereum
 * @internal
 */

export class ContractsGateway implements IContractsGateway {
  private provider: JsonRpcProvider | Web3Provider


  /**
   * @constructor
   * @param provider - JSON RPC endpoint for broadcasting transactions, or configured web3 provider
   */

  constructor(provider: string | Web3Provider) {
    if (typeof provider === 'string') {
      this.provider = new ethers.providers.JsonRpcProvider(provider)
    } else {
      this.provider = provider
    }
  }

  /**
   * Get details about the used network
   * @example `ethGateway.getNetworkInfo()` // {name: 'rinkeby', chainId: 4, endpoint: 'https://rinkeby.infura.io'}
   */

  public getNetworkInfo() {
    if (!this.provider.network) {
      return {}
    }

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
