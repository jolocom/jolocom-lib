import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib'
import { keyTypes } from '../index'

export interface IKeyResponse {
  wif: string
  publicKey: Buffer
  keyType: string
  path: string
}

/* @summary - Generates a seed phrase based on provided entropy
 * @param {string} randomStringFromEntropy - a random string generated from entropy.
 * @returns {string} - a BIP39 compliant 12 word mnemonic
 */
export function generateMnemonic(randomStringFromEntropy: string) {
  return bip39.entropyToMnemonic(randomStringFromEntropy)
}

/* @summary - Generates a keypair based on provided entropy
 * @param {string} mnemonic - a BIP39 compliant 12 word mnemonic generated from
 * hashed entropy.
 * @returns {HDNode} - an instance containing a master keypair and a default
 * Bitcoin network object.
 */
export function deriveMasterKeyPairFromMnemonic(mnemonic: string) {
  const seed = bip39.mnemonicToSeed(mnemonic)
  return bitcoin.HDNode.fromSeedBuffer(seed)
}

/* @summary - Generate a generic signing key according to BIP32 specification
 * @param {HDNode} masterKeyPair - the master keypair used to
 *        derive the child key.
 * @param {string} path - the path to traverse for HD derivation
 * @returns {object} - the wif of the key and the path
 */

export function deriveGenericSigningKeyPair(masterKeyPair: any, path?: string): IKeyResponse {
  if (!path) {
    path = keyTypes.jolocomIdentityKey
  }

  const derived = masterKeyPair.derivePath(path).keyPair

  return {
    wif: derived.toWIF(),
    publicKey: derived.getPublicKeyBuffer(),
    keyType: 'ECDSA secp256k1',
    path
  }
}

/* @summary - Generate an Ethereum keypair according to BIP44
 * @param {HDNode} masterKeyPair - the master keypair used to
 *        derive the child key.
 * @param {string} path - the path to traverse for HD derivation
 * @returns {object} - the wif of the key and the path
 */
export function deriveEthereumKeyPair(masterKeyPair: any, path?: string): IKeyResponse {
  if (!path) {
    path = keyTypes.ethereumKey
  }

  const derived = masterKeyPair.derivePath(path).keyPair

  return {
    wif: derived.toWIF(),
    publicKey: derived.getPublicKeyBuffer(),
    keyType: 'ECDSA secp256k1',
    path
  }
}
