import { IdentityWallet } from '../identityWallet/identityWallet'
import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import {
  IKeyDerivationArgs,
  IVaultedKeyProvider,
} from '../vaultedKeyProvider/types'
import { publicKeyToDID } from '../utils/crypto'
import { mnemonicToEntropy, validateMnemonic } from 'bip39'
import { JoloDidMethod } from '../didMethods/jolo'
import { SocialRecovery } from './socialRecovery'
import { authJoloIdentity } from '../didMethods/jolo/utils'

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

async function recoverFromSeedPhrase(
  resolver = new JoloDidMethod().resolver,
  mnemonicPhrase: string,
  keyMetaData: IKeyDerivationArgs,
): Promise<IdentityWallet> {
  let did: string
  let vault: IVaultedKeyProvider
  const { seedPhrase, didPhrase } = sliceSeedPhrase(mnemonicPhrase)
  vault = SoftwareKeyProvider.recoverKeyPair(
    seedPhrase,
    keyMetaData.encryptionPass,
  )
  if (didPhrase) {
    did = 'did:jolo:' + mnemonicToEntropy(didPhrase)
  } else {
    did = publicKeyToDID(vault.getPublicKey(keyMetaData))
  }
  return authJoloIdentity(vault, keyMetaData.encryptionPass, resolver)
}

async function recoverFromShards(
  resolver = new JoloDidMethod().resolver,
  shards: string[],
  keyMetaData: IKeyDerivationArgs,
): Promise<IdentityWallet> {
  const { did, secret } = SocialRecovery.combineShard(shards)
  const vault = SoftwareKeyProvider.fromSeed(
    Buffer.from(secret, 'hex'),
    keyMetaData.encryptionPass,
  )

  return authJoloIdentity(vault, keyMetaData.encryptionPass, resolver)
}

export { recoverFromSeedPhrase, recoverFromShards }
