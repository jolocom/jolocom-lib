import { Identity } from '../identity/identity'
import {IVaultedKeyProvider, KeyTypes} from '../vaultedKeyProvider/types'
import { IKeyMetadata } from '../credentials/signedCredential/types'
import {IContractsAdapter, IContractsGateway} from '../contracts/types'

export interface IIdentityWalletCreateArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  identity: Identity
  publicKeyMetadata: IKeyMetadata
  contractsAdapter: IContractsAdapter
  contractsGateway: IContractsGateway
}

export type PublicKeyMap = {[key in keyof typeof KeyTypes]?: string}
