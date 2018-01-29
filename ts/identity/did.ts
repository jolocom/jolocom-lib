import * as bs58 from 'bs58'

/* Creates Identity id according to DID/DDO specifications
 * Source: https://w3c-ccg.github.io/did-spec/
 */
export default class Did{
  identifier: string

  constructor() {}

  static create(publicKey: Buffer) {
    const did = new Did()
    const prefix = 'did:jolo:'
    const suffix = bs58.encode(publicKey.subarray(0, 16))
    did.identifier = prefix + suffix
    return did
  }

  toJSON(): string {
    return this.identifier
  }

  static fromJSON(json: string): Did {
    const did = Object.create(Did.prototype)
    return Object.assign(did, {
      identifier: json
    })
  }
}
