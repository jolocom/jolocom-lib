import {IContractConnector} from './types'
import {ethers} from 'ethers'
import {JsonRpcProvider} from 'ethers/providers'

export class ContractConnector implements IContractConnector {
  private provider: JsonRpcProvider

  constructor(providerUrl: string) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
  }

  public async getAddressNonce(address: string) {
    return this.provider.getTransactionCount(address)
  }

  public async broadcastTransaction(serializedTx: string): Promise<string> {
    return this.provider.sendTransaction(serializedTx).then(({hash}) => hash)
  }
}

export const jolocomContractConnector = new ContractConnector('https://rinkeby.infura.io/')
