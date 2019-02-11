import * as Transaction from 'ethereumjs-tx'
import { ICreateEthTransactionAttrs } from './types'
import { ethers, utils } from 'ethers'

/**
 * Note that this is an experimental implementation to allow for payments on Ethereum
 */

export class EthereumTransactionConnector {
  private provider: any

  constructor(providerUri: string) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUri)
  }

  // TODO: type return value
  public async createTransaction(args: ICreateEthTransactionAttrs): Promise<any> {
    const {
      senderAddress,
      receiverAddress,
      amountInEther,
      chainId = 4,
      gasPriceInWei = 10e9, // 10 gwei set as default
      gasLimit = 21000
    } = args
  
    return new Transaction({
      nonce: await this.provider.getTransactionCount(senderAddress),
      gasPrice: utils.hexlify(gasPriceInWei),
      gasLimit,
      to: receiverAddress,
      value: utils.hexlify(utils.parseEther(amountInEther)),
      chainId
    })
  }

  // TODO: type return value
  public async sendSignedTransaction(serializedTx: Buffer): Promise<any> {
    return this.provider
      .sendTransaction(`0x${serializedTx.toString('hex')}`)
  }
}

/* Instantiates a transaction connector using the default configuration */

export const jolocomEthTransactionConnector = new EthereumTransactionConnector(
  'https://rinkeby.infura.io'
)
