import { IIpfsConnector } from '../ipfs/types'
import { IEthereumConnector } from '../ethereum/types'

export interface IRegistryStaticCreationArgs {
  ipfsConnector: IIpfsConnector
  ethereumConnector: IEthereumConnector
}

export interface ISigner {
  did: string
  keyId: string
}
