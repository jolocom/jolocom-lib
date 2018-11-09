import { IdentityWallet } from '../identityWallet/identityWallet'
import { IVaultedKeyProvider, IKeyDerivationArgs } from '../vaultedKeyProvider/softwareProvider'

export interface IRegistryCommitArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  keyMetadata: IKeyDerivationArgs
  identityWallet: IdentityWallet
}
