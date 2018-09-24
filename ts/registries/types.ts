import { IIpfsConnector } from '../ipfs/types'
import { IEthereumConnector } from '../ethereum/types'
import { IdentityWallet } from '../identityWallet/identityWallet'

export interface IRegistryInstanceCreationArgs {
  privateIdentityKey: Buffer
  privateEthereumKey: Buffer
}

export interface IRegistryStaticCreationArgs {
  ipfsConnector: IIpfsConnector
  ethereumConnector: IEthereumConnector
}

export interface IRegistryCommitArgs {
  wallet: IdentityWallet,
  privateEthereumKey: Buffer
}

export interface IVerifiable {
  validateSignatureWithPublicKey: (pubKey: Buffer) => Promise<boolean>
  getSigner: () => string
}