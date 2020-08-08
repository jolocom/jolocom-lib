import * as createHash from 'create-hash'
import { keccak256 } from 'ethereumjs-util'
import { randomBytes } from 'crypto'
import { getCryptoProvider } from '@jolocom/vaulted-key-provider'
import { cryptoUtils } from '@jolocom/native-utils-node'

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

// TODO This needs to be used everywhere where rng is needed.
export async function getRandomBytes(nr: number): Promise<Buffer> {
  return await getCryptoProvider(cryptoUtils).getRandom(nr)
}
