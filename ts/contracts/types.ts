import {IVaultedKeyProvider} from '../vaultedKeyProvider/types'
import {BigNumber} from 'ethers/utils'

type AddressInfo = {
  nonce: number
  balance: BigNumber
}

type ContractsGatewayInfo = {
  name: string
  chainId: number
  endpoint: string
}

export interface IContractsAdapter {
  assembleTxFromInteractionToken: (
    requestToken: ITransactionEncodable,
    from: string,
    nonce: number,
    vault: IVaultedKeyProvider,
    pass: string
  ) => string
}

export interface IContractsGateway {
  getNetworkInfo: () => ContractsGatewayInfo | {}
  getAddressInfo: (address: string) => Promise<AddressInfo>
  broadcastTransaction: (serializedTransaction: string) => Promise<string>
}

export interface ITransactionEncodable {
  transactionOptions: TransactionOptions
}

export type TransactionOptions = {
  value: number,
  to: string,
  gasLimit: number,
  gasPrice: number
}
