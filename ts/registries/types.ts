import { IdentityWallet } from '../identityWallet/identityWallet'
import {
  IVaultedKeyProvider,
  IKeyDerivationArgs,
} from '../vaultedKeyProvider/types'
import { Identity } from '../identity/identity'
import { Resolver } from 'did-resolver'
import { Registrar } from '../registrars/types'

export interface IRegistryCommitArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  keyMetadata: IKeyDerivationArgs
  identityWallet: IdentityWallet
}

export interface ISigner {
  did: string
  keyId: string
}

export interface DidMethodImplementation<T, U> {
  prefix: string
  resolver: Resolver,
  registrar: Registrar<T, U>
}

export interface IRegistry {
  create: (
    vaultedKeyProvider: IVaultedKeyProvider,
    decryptionPassword: string,
  ) => Promise<IdentityWallet>
  resolve: (did: string) => Promise<Identity>
  authenticate: (
    vaultedKeyProvider: IVaultedKeyProvider,
    password: string,
  ) => Promise<IdentityWallet>
}
