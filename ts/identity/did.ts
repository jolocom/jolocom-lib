import { utils } from 'web3'

/* Creates Identity id according to DID/DDO specifications
 * Source: https://w3c-ccg.github.io/did-spec/
 */
export default class Did{
  public identifier: string
  constructor(publicKey: Buffer) {
    const prefix = 'did:jolo:'
    const suffix = utils.soliditySha3(publicKey)
    this.identifier = prefix + suffix
  }

  toJSON(): string {
    return this.identifier
  }

  static fromJson(id: string): Did {
    let did = Object.create(Did.prototype)
    return Object.assign(did, id, {
      identifier: id
    })
  }
}
