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
 * Returns the did method prefix, given a did
 * @param did
 * @example `getMethodPrefixFromDid('did:jolo:abc') // jolo`
 */

export const getMethodPrefixFromDid = (did: string) => {
  return did.substring(4, did.lastIndexOf(':'))
}
