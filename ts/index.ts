import IdentityConfig from './identity/types'
import Identity from './identity/index'

export default class JolocomLib {
  private identity: any
  public config: IdentityConfig

  constructor(config: IdentityConfig) {
    this.identity = Identity.initialize(config)
  }
}
