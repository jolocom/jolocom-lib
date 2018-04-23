import { IEthereumResolverConfig } from './ethereum/types'
import { IIpfsConfig, IIpfsConnector } from './ipfs/types'

export interface ILibConfig {
  identity: IEthereumResolverConfig
  ipfs: IIpfsConfig
  IpfsConnector?: IIpfsConnector
}
