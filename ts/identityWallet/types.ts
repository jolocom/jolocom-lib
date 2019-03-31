import { Identity } from '../identity/identity'
import { IVaultedKeyProvider } from '../vaultedKeyProvider/types'
import { IKeyMetadata } from '../credentials/signedCredential/types'
import {IContractsAdapter, IContractsGateway} from '../contracts/types'

export interface IIdentityWalletCreateArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  identity: Identity
  publicKeyMetadata: IKeyMetadata
  contractHandler: IContractsAdapter
  contractConnector: IContractsGateway
}
