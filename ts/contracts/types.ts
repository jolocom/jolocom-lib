import { IVaultedKeyProvider } from '../vaultedKeyProvider/types'

interface ContractsGatewayInfo {
  name: string
  chainId: number
  endpoint: string
}

interface AddressInfo {
  nonce: number
  balance: number
}

export interface IContractsAdapter {
  assembleTxFromInteractionToken: (
    requestToken: ITransactionEncodable,
    from: string,
    nonce: number,
    vault: IVaultedKeyProvider,
    pass: string,
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

export interface TransactionOptions {
  value: number
  to: string
  gasLimit: number
  gasPrice: number
}
