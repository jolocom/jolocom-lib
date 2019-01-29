import * as Transaction from 'ethereumjs-tx'
import { ICreateEthTransactionAttrs } from './types'
const Web3 = require('web3')

/**
 * Note that this is an experimental implementation to allow for payments on Ethereum
 */

export class EthereumTransactionConnector {
  private web3: any

  constructor(providerUri: string) {
    const provider = new Web3.providers.HttpProvider(providerUri)
    this.web3 = new Web3(provider)
  }

  // TODO: type return value
  public async createTransaction(args: ICreateEthTransactionAttrs): Promise<any> {
    const {
      senderAddress,
      receiverAddress,
      amountInEther,
      chainId = 4,
      gasPriceInWei = this.web3.utils.toHex(this.web3.utils.toWei('10', 'gwei')),
      gasLimit = 21000
    } = args
  
    return new Transaction({
      nonce: await this.web3.eth.getTransactionCount(senderAddress),
      gasPrice: gasPriceInWei,
      gasLimit,
      to: receiverAddress,
      value: this.web3.utils.toHex(this.web3.utils.toWei(amountInEther, 'ether')),
      chainId
    })
  }

  public async sendSignedTransaction(serializedTx: Buffer): Promise<string> {
    return this.web3.eth
      .sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
  }
}

/* Instantiates a transaction connector using the default configuration */

export const jolocomEthTransactionConnector = new EthereumTransactionConnector(
  'https://rinkeby.infura.io/'
)
