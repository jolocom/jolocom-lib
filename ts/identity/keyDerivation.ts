import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'

/* @summary - Generates a seed phrase based on provided entropy
 * @param {string} randomStringFromEntropy - a random string generated from entropy.
 * @returns {string} - a BIP39 compliant mnemonic
 */
export function generateMnemonic(randomStringFromEntropy: string) {
  return bip39.entropyToMnemonic(randomStringFromEntropy)
}

/* @summary - Generates a keypair based on provided entropy
 * @param {string} mnemonic - a BIP39 compliant mnemonic generated from hashed entropy.
 * @returns {HDNode} - an instance containing a master keypair and a default Bitcoin network object.
 */
export function deriveMasterKeyPairFromMnemonic(mnemonic: string) {
  const seed = bip39.mnemonicToSeed(mnemonic)
  return bitcoin.HDNode.fromSeedBuffer(seed)
}

/* @summary - Generate a generic signing key according to BIP32 specification
 * @param {HDNode} masterKeyPair - the master keypair used to
 *        derive the child key.
 * @returns {HDNode} - the derived child  generic signing key.
 */

export function deriveGenericSigningKeyPair(masterKeyPair: any) {
  return masterKeyPair.derivePath("m/73'/0'/0'")
}

/* @summary - Generate an Ethereum keypair according to BIP44
 * @param {HDNode} masterKeyPair - the master keypair used to
 *        derive the child key.
 * @returns {HDNode} - the derived Ethereum keypair.
 */
export function deriveEthereumKeyPair(masterKeyPair: any) {
  return masterKeyPair.derivePath("m/44'/60'/0'/0/0")
}
