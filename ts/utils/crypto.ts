import * as createHash from 'create-hash'
import { getCryptoProvider } from '@jolocom/vaulted-key-provider'
import { cryptoUtils } from '@jolocom/native-core'
import { isHexString } from 'ethers/lib/utils'

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

// TODO A bit more precise. Prepending 0x won't always work if the string is already prefixed
export const parseHexOrBase64 = (hexOrBase64: string) =>
  Buffer.from(hexOrBase64, isHexString(`0x${hexOrBase64}`) ? 'hex' : 'base64')

// Exporting for consuming applications (e.g. the SDK).
export { mnemonicToEntropy, entropyToMnemonic } from 'bip39'
