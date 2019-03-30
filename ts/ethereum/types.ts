import {ITransactionOptions} from '../interactionTokens/interactionTokens.types'
import {IVaultedKeyProvider} from '../vaultedKeyProvider/types'

export interface IEthereumResolverConfig {
  providerUrl: string
  contractAddress: string
}

export interface IEthereumResolverUpdateDIDArgs {
  ethereumKey: Buffer
  did: string
  newHash: string
}

export interface IEthereumConnector {
  resolveDID: (did: string) => Promise<string>
  updateDIDRecord: (args: IEthereumResolverUpdateDIDArgs) => Promise<void>
}

export interface IContractHandler {
  assembleTransaction: (request: ITransactionEncodable, from: string, nonce: number, vault: IVaultedKeyProvider, pass: string) => string
}

export interface IContractConnector {
  getAddressNonce: (address: string) => Promise<number>
  broadcastTransaction: (serializedTransaction: string) => Promise<string>
}

export interface ITransactionEncodable {
  transactionOptions: ITransactionOptions
}

