import { Identity } from '../identity/identity'
import { IKeyMetadata } from '../credentials/signedCredential/types'
import { IContractsAdapter, IContractsGateway } from '../contracts/types'
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'

export interface IIdentityWalletCreateArgs {
  vaultedKeyProvider: SoftwareKeyProvider
  identity: Identity
  publicKeyMetadata: IKeyMetadata
  contractsAdapter: IContractsAdapter
  contractsGateway: IContractsGateway
}

/**
 * Will set all keys on an interface to Optional (?), except the provided one.
 * @example ExclusivePartial<{name: string, age: number}, "name"> // {name: string, age?: number}
 */

export type ExclusivePartial<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>
