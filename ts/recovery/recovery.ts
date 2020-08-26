import { mnemonicToEntropy, validateMnemonic } from 'bip39'
import { JoloDidMethod } from '../didMethods/jolo'
import { EncryptedWalletUtils } from '@jolocom/vaulted-key-provider'
import { joloSeedToEncryptedWallet } from '../didMethods/jolo/registrar'
import { authAsIdentityFromKeyProvider } from '../didMethods/utils'
import { SocialRecovery } from './socialRecovery'

/**
 * List of possible seed phrase lengths referring to the BIP39 spec (https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
 */
const SEED_PHRASE_LENGTH_LIST = [12, 15, 18, 21, 24]

/**
 * This method tries to separate the mnemonic into a mnemonic that encodes the seed and mnemonic that encodes the DID
 * @param seedPhrase - Seed Phrase that can possibly contain to mnemonic strings
 * @returns the mnemonic that encodes the seed and the mnemonic that encodes the DID in 2 separate variables
 */
function sliceSeedPhrase(
  seedPhrase: string,
): { seedPhrase: string; didPhrase: string } {
  const seedPhraseArray = seedPhrase.split(' ')
  let currentSeedLength: number

  SEED_PHRASE_LENGTH_LIST.forEach(seedPhraseLength => {
    if (validateMnemonic(seedPhraseArray.slice(0, seedPhraseLength).join(' ')))
      currentSeedLength = seedPhraseLength
  })

  return {
    seedPhrase: seedPhraseArray.slice(0, currentSeedLength).join(' '),
    didPhrase: seedPhraseArray.slice(currentSeedLength).join(' '),
  }
}

export const joloMnemonicToEncryptedWallet = async (
  mnemonicPhrase: string,
  newPassword: string,
  impl: EncryptedWalletUtils,
) => {
  const { seedPhrase, didPhrase } = sliceSeedPhrase(mnemonicPhrase)

  const seed = Buffer.from(
    mnemonicToEntropy(seedPhrase), 'hex'
  )

  const did = didPhrase && `did:jolo:${mnemonicToEntropy(didPhrase)}`;

  return joloSeedToEncryptedWallet(seed, newPassword, impl, did)
}

const recoverFromSeedPhrase = async (
  mnemonicPhrase: string,
  newPassword: string,
  impl: EncryptedWalletUtils,
  resolver = new JoloDidMethod().resolver,
) => authAsIdentityFromKeyProvider(
    await joloMnemonicToEncryptedWallet(mnemonicPhrase, newPassword, impl),
    newPassword,
    resolver
  )


const recoverFromShards = async (
  shards: string[],
  newPassword: string,
  impl: EncryptedWalletUtils,
  resolver = new JoloDidMethod().resolver,
) => {
  const { did, secret } = SocialRecovery.combineShard(shards)

  return authAsIdentityFromKeyProvider(
    await joloSeedToEncryptedWallet(
      Buffer.from(secret, 'hex'),
      newPassword,
      impl,
      did
    ), newPassword, resolver)
}

export { recoverFromSeedPhrase, recoverFromShards }
