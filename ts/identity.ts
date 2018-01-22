import * as bs58 from 'bs58'

export default class DID {
  identifier: string
  constructor(publicKey: Buffer) {
    const prefix = 'did:jolo:'
    const suffix = bs58.encode(publicKey)
    this.identifier = prefix + suffix
  }
}
