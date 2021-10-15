import { mnemonicToEntropy, validateMnemonic, entropyToMnemonic } from 'bip39'
import { ErrorCodes } from '../errors'
import { SocialRecovery } from './socialRecovery'

/**
 * List of possible valid seed phrase lengths referring to the BIP39 spec (https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 */
export const SEED_PHRASE_LENGTH_LIST = [12, 15, 18, 21, 24]

/**
 * This method tries to separate the mnemonic into a mnemonic that encodes the seed and mnemonic that encodes the DID
 * @param seedPhrase - Seed Phrase that can possibly contain to mnemonic strings
 * @returns the mnemonic that encodes the seed and the mnemonic that encodes the DID in 2 separate variables
 */

export function sliceSeedPhrase(
  seedPhrase: string,
): { seed: string; encodedDid: string } {
  const seedPhraseArray = seedPhrase.split(' ')

  const divideAt = SEED_PHRASE_LENGTH_LIST.find(l =>
    validateMnemonic(seedPhraseArray.slice(0, l).join(' ')),
  )

  const firstEncodedValue = seedPhraseArray.slice(0, divideAt)
  const secondEncodedValue = seedPhraseArray.slice(divideAt)

  if (!secondEncodedValue.length) throw new Error(ErrorCodes.SKPMnemonicInvalid)

  return {
    seed: mnemonicToEntropy(firstEncodedValue.join(' ')),
    encodedDid: mnemonicToEntropy(secondEncodedValue.join(' ')),
  }
}

export const shardsToMnemonic = async (shards: string[]) => {
  const { did, secret } = SocialRecovery.combineShard(shards)
  return {
    didPhrase: entropyToMnemonic(Buffer.from(did, 'hex')),
    seed: entropyToMnemonic(secret),
  }
}
