import { keccak256 } from 'ethereumjs-util'

/**
 * Converts a public key to the corresponding did
 * @param publicKey
 * @example `publicKeyToDid(Buffer.from('03848a...', 'hex')) // 'did:jolo:...'`
 * @ignore
 */

export function publicKeyToDID(publicKey: Buffer, prefix: string): string {
  const method = `did:${prefix}:`
  const suffix = keccak256(publicKey)
  return method + suffix.toString('hex')
}
