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
 * @TODO Find better place for these.
 */
type DigestFunction = (toDigest: Buffer) => Buffer
export type DidBuilder = (publicKey: Buffer) => string

/**
 * Curried function for assembling a {@link DidBuilder}.
 *   Curried to take a DID prefix string, followed by a {@link DigestFunction} (used for generating the ID from the public key)
 * @param prefix: DID method prefix, e.g. 'jolo'
 * @example `publicKeyToDid('jolo')(Buffer.from('03848a...', 'hex')) // 'did:jolo:...'`
 * @returns - configured {@link DidBuilder}
 */

export const publicKeyToDID = (prefix: string) => (
  digestFunction: DigestFunction,
): DidBuilder => publicKey =>
  `did:${prefix}:${digestFunction(publicKey).toString('hex')}`

/**
 * Creates a {@link DidBuilder} configured to generate Jolocom DIDs (e.g. "did:jolo:aaa...aaa")
 * @param publicKey - A buffer containing the user's public identity key.
 * @example `publicKeyToJoloDID(Buffer.from('03848a...', 'hex')) // 'did:jolo:...'`
 * @returns
 */

export const publicKeyToJoloDID = publicKeyToDID('jolo')(keccak256)

/**
 * Returns the did method prefix, given a did
 * @param did
 * @example `getMethodPrefixFromDid('did:jolo:abc') // jolo`
 */

export const getMethodPrefixFromDid = (did: string) => {
  return did.substring(4, did.lastIndexOf(':'))
}
