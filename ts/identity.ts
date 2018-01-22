import * as bs58 from 'bs58'

export default class DID {
  identifier: string
  constructor(publicKey: Buffer) {
    const prefix = 'did:jolo:'
    const suffix = bs58.encode(publicKey.subarray(0, 16))
    this.identifier = prefix + suffix
  }
}
