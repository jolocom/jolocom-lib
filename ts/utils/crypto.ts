import * as createHash from 'create-hash'
import { keccak256 } from 'ethereumjs-util'

/**
 * Computes the sha256 hash of the provided input
 * @param data - Data to be hashed
 * @example `sha256(Buffer.from('hello'))`
 * @ignore
 */

export function sha256(data: Buffer): Buffer {
  return createHash('sha256')
    .update(data)
    .digest()
}

/**
 * Converts a public key to the corresponding did
 * @param publicKey
 * @example `publicKeyToDid(Buffer.from('03848a...', 'hex')) // 'did:jolo:...'`
 * @ignore
 */

export function publicKeyToDID(publicKey: Buffer): string {
  const prefix = 'did:jolo:'
  const suffix = keccak256(publicKey)
  return prefix + suffix.toString('hex')
}

/**
 * Generates a "random" sequence of bytes
 * @param nrOfBytes - The size of the output
 * @ignore
 */

/* TODO Revert to previous implementation once compatibility issues are sorted */
export function generateRandomID(nrOfBytes: number): string {
  return Math.random()
    .toString(16)
    .substr(2)
}

/*
const result = Buffer.allocUnsafe(nrOfBytes)
random.randomWords(nrOfBytes / 4).forEach((el, index) => {
  result.writeInt32LE(el, index * 4)
})

return result.toString('hex')
*/
