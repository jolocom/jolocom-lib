import * as createHash from 'create-hash'
import { keccak256 } from 'ethereumjs-util'

export function sha256(data: Buffer): Buffer {
  return createHash('sha256')
    .update(data)
    .digest()
}

export function publicKeyToDID(publicKey: Buffer): string {
  const prefix = 'did:jolo:'
  const suffix = keccak256(publicKey)
  return prefix + suffix.toString('hex')
}

// TODO Seed properly, causes issues on RN due to lack of default csrng operations.
export function generateRandomID(nrOfBytes: number): string {
  return Math.random()
    .toString(16)
    .substr(2)
  /*
  const result = Buffer.allocUnsafe(nrOfBytes)
  random.randomWords(nrOfBytes / 4).forEach((el, index) => {
    result.writeInt32LE(el, index * 4)
  })

  return result.toString('hex')
  */
}
