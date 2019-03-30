import { Identity } from '../identity/identity'
import { IVaultedKeyProvider } from '../vaultedKeyProvider/types'
import { IKeyMetadata } from '../credentials/signedCredential/types'
import {IContracts, IContractsGateway} from '../contracts/types'

export interface IIdentityWalletCreateArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  identity: Identity
  publicKeyMetadata: IKeyMetadata
  contractHandler: IContracts
  contractConnector: IContractsGateway
}
