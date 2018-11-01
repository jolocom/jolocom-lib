import { Identity } from '../identity/identity'
import { IVaultedKeyProvider } from '../crypto/softwareProvider'
import { IKeyMetadata } from './identityWallet'

export interface IIdentityWalletCreateArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  identity: Identity
  publicKeyMetadata: IKeyMetadata
}

export interface IPrivateKeyWithId {
  key: Buffer
  id: string
}
