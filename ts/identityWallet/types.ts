import { Identity } from '../identity/identity'
import { IVaultedKeyProvider, KeyTypes } from '@jolocom/vaulted-key-provider'

export interface IIdentityWalletCreateArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  identity: Identity
  publicKeyMetadata: IKeyMetadata
}

/**
 * Will set all keys on an interface to Optional (?), except the provided one.
 * @example ExclusivePartial<{name: string, age: number}, "name"> // {name: string, age?: number}
 */

export type ExclusivePartial<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>

type PubKeyEntry = {
  keyId: string
  type: KeyTypes
}

export interface IKeyMetadata {
  signingKey: PubKeyEntry
  encryptionKey: PubKeyEntry
  [key: string]: PubKeyEntry
}
