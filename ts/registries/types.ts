import { IIpfsConnector } from '../ipfs/types'
import { IEthereumConnector } from '../ethereum/types'
import { IdentityWallet } from '../identityWallet/identityWallet'
import { IVaultedKeyProvider, IKeyDerivationArgs } from '../crypto/softwareProvider';

export interface IRegistryInstanceCreationArgs {
  publicIdentityKey: Buffer
  privateEthereumKey: Buffer
}

export interface IRegistryStaticCreationArgs {
  ipfsConnector: IIpfsConnector
  ethereumConnector: IEthereumConnector
}

export interface IRegistryCommitArgs {
  vaultedKeyProvider: IVaultedKeyProvider,
  keyMetadata: IKeyDerivationArgs
  identityWallet: IdentityWallet
}

export interface IVerifiable {
  validateSignatureWithPublicKey: (pubKey: Buffer) => Promise<boolean>
  getSigner: () => ISigner
}

export interface ISigner {
  did: string
  keyId: string
}