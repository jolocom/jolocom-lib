import { IdentityWallet } from '../identityWallet/identityWallet'
import { publicKeyToDID } from '../utils/crypto'
import { mnemonicToEntropy, validateMnemonic } from 'bip39'
import { JoloDidMethod } from '../didMethods/jolo'
import { SocialRecovery } from './socialRecovery'
import { IKeyRefArgs } from '@jolocom/vaulted-key-provider'

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
  keyMetaData: IKeyRefArgs,
//@ts-ignore - REIMPLEMENT
): Promise<IdentityWallet> {
  // let did: string
  // let vault: SoftwareKeyProvider
  // const { seedPhrase, didPhrase } = sliceSeedPhrase(mnemonicPhrase)
  // vault = SoftwareKeyProvider.recoverKeyPair(
  //   seedPhrase,
  //   keyMetaData.encryptionPass,
  // )
  // if (didPhrase) {
  //   did = 'did:jolo:' + mnemonicToEntropy(didPhrase)
  // } else {
  //   did = publicKeyToDID(vault.getPublicKey(keyMetaData))
  // }
  // return authJoloIdentity(await SoftwareKeyProvider.newEmptyWallet(cryptoUtils, '', 'hello'), keyMetaData.encryptionPass, resolver)
}

async function recoverFromShards(
  resolver = new JoloDidMethod().resolver,
  shards: string[],
  keyMetaData: IKeyRefArgs,
//@ts-ignore - REIMPLEMENT
): Promise<IdentityWallet> {
  // const { did, secret } = SocialRecovery.combineShard(shards)
  // const vault = SoftwareKeyProvider.fromSeed(
  //   Buffer.from(secret, 'hex'),
  //   keyMetaData.encryptionPass,
  // )

  // return authJoloIdentity(vault, keyMetaData.encryptionPass, resolver)
}

export { recoverFromSeedPhrase, recoverFromShards }
