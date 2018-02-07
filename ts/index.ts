import IdentityConfig from './identity/types'
import IpfsStorageAgent from './storage/ipfsStorageAgent'
import Identity from './identity/index'

export default class JolocomLib {
  private identity: any

  constructor(config: IConfig) {
    this.identity = new Identity(config)
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
