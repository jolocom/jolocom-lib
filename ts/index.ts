import IdentityConfig from './identity/types'
import { IpfsConfig } from './identity/types'
import IpfsStorageAgent from './storage/ipfsStorageAgent'
import Identity from './identity/index'
import Authentication from './sso/index'

export default class JolocomLib {
  private identity: Identity
  private authentication: Authentication

  constructor(config: IConfig) {
    this.identity = new Identity(config)
    this.authentication = new Authentication()
  }
}

export interface IConfig {
  identity: IdentityConfig;
  ipfs: IpfsConfig;
}
