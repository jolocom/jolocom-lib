import { Identity } from '../identity/identity'
import { IVaultedKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { IKeyMetadata } from '../credentials/signedCredential/types'

export interface IIdentityWalletCreateArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  identity: Identity
  publicKeyMetadata: IKeyMetadata
}