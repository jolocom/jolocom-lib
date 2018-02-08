const Web3 = require('web3')

export default class Did {
  public identifier: string

  constructor(publicKey: string) {
    const prefix = 'did:jolo:'
    const suffix = Web3.utils.soliditySha3(publicKey)
    this.identifier = prefix + suffix
  }

  public static fromJSON(json: string): Did {
    const did = Object.create(Did.prototype)
    return Object.assign(did, {
      identifier: json,
    })
  }

  public toJSON(): string {
    return this.identifier
  }
}
