import { IIpfsConnector } from '../ipfs/types'
import { IEthereumConnector } from '../ethereum/types'
import { IdentityWallet } from '../identityWallet/identityWallet'
import { IVaultedKeyProvider, IKeyDerivationArgs } from '../vaultedKeyProvider/softwareProvider'

export interface IRegistryStaticCreationArgs {
  ipfsConnector: IIpfsConnector
  ethereumConnector: IEthereumConnector
}

export interface IRegistryCommitArgs {
  vaultedKeyProvider: IVaultedKeyProvider
  keyMetadata: IKeyDerivationArgs
  identityWallet: IdentityWallet
}
export interface ISigner {
  did: string
  keyId: string
}
