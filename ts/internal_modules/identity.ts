import * as bs58 from 'bs58'

export default class DID {
  identifier: string
  constructor(publicKey: Buffer) {
    const fragment = bs58.encode(publicKey)
    this.identifier = 'did:jolo:'+ fragment
  }
}