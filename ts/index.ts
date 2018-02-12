import IdentityConfig from './identity/types'
import { IpfsConfig } from './identity/types'
import IpfsStorageAgent from './storage/ipfsStorageAgent'
import Identity from './identity/index'
import Authentication from './sso/index'
import Claims from './claims/index'

export default class JolocomLib {
  public identity: Identity;
  public authentication: Authentication;
  public claims: Claims;

  constructor(config: IConfig) {
    this.identity = new Identity(config)
    this.authentication = new Authentication()
    this.claims = new Claims()
  }
}

export interface IConfig {
  identity: IdentityConfig;
  ipfs: IpfsConfig;
}
