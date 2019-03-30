import { Identity } from '../identity/identity'
import { IVaultedKeyProvider } from '../vaultedKeyProvider/types'
import { IKeyMetadata } from '../credentials/signedCredential/types'
import {IContractConnector, IContractHandler} from '../ethereum/types'

export interface IIdentityWalletCreateArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  identity: Identity
  publicKeyMetadata: IKeyMetadata
  contractHandler: IContractHandler
  contractConnector: IContractConnector
}
