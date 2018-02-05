import IdentityConfig from './identity/types'
import IpfsStorageAgent from './storage/ipfsStorageAgent'
import Identity from './identity/index'

export default class JolocomLib {
  private identity: any
  private ipfs: any

  constructor(config: IConfig) {
    this.identity = Identity.initialize(config.identity)
    this.ipfs = new IpfsStorageAgent(config.ipfs)
  }
}

export interface IConfig {
  identity: IdentityConfig;
  ipfs: {
    host: string;
    port: number;
    protocol: string;
  }
}
