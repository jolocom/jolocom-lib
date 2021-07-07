import * as createHash from 'create-hash'
import { getCryptoProvider } from '@jolocom/vaulted-key-provider'
import { cryptoUtils } from '@jolocom/native-core'

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

// TODO This needs to be used everywhere where rng is needed.
export async function getRandomBytes(nr: number): Promise<Buffer> {
  return getCryptoProvider(cryptoUtils).getRandom(nr)
}

// Exporting for consuming applications (e.g. the SDK).
export { mnemonicToEntropy, entropyToMnemonic } from 'bip39'
