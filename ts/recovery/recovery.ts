import { IdentityWallet } from '../identityWallet/identityWallet'
import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import {
  IKeyDerivationArgs,
  IVaultedKeyProvider,
} from '../vaultedKeyProvider/types'
import { publicKeyToJoloDID } from '../utils/crypto'
import { mnemonicToEntropy, validateMnemonic } from 'bip39'
import { JolocomRegistry } from '../registries/jolocomRegistry'
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
  let currentSeedLength
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
  registry: JolocomRegistry,
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
    did = publicKeyToJoloDID(vault.getPublicKey(keyMetaData))
  }
  return await registry.authenticate(vault, keyMetaData, did)
}

async function recoverFromShards(
  registry: JolocomRegistry,
  shards: string[],
  keyMetaData: IKeyDerivationArgs,
): Promise<IdentityWallet> {
  const { did, secret } = SocialRecovery.combineShard(shards)
  const vault = SoftwareKeyProvider.fromSeed(
    Buffer.from(secret, 'hex'),
    keyMetaData.encryptionPass,
  )
  return await registry.authenticate(vault, keyMetaData, did)
}

export { recoverFromSeedPhrase, recoverFromShards }
