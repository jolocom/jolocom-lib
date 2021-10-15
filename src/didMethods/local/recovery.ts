import {
  SoftwareKeyProvider,
  EncryptedWalletUtils,
} from '@jolocom/vaulted-key-provider'
import { getIcpFromKeySet } from '@jolocom/native-core'
// @ts-ignore
import { derivePath } from '@hawkingnetwork/ed25519-hd-key-rn'
import { IDidMethod } from '../types'
import { authAsIdentityFromKeyProvider } from '../utils'
import { mnemonicToEntropy } from 'bip39'

const DERIVATION_PATHS = {
  controlKey: "m/73'/0'/0'",
  preRotatedControlKey: "m/73'/0'/1'",
  encKey: "m/73'/1'/0'",
  preRotatedEncKey: "m/73'/1'/1'",
}

const toBase64UrlSafe = (toEncode: Buffer) => {
  const b64 = toEncode.toString('base64')
  return b64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

export const slip10DeriveKey = (seed: Buffer) => (path: String): Buffer =>
  derivePath(path, seed).key

export const recoverJunKeyProviderFromSeed = async (
  seed: Buffer,
  newPassword: string,
  impl: EncryptedWalletUtils,
) => {
  const derivationFn = slip10DeriveKey(seed)

  const controlKey = toBase64UrlSafe(derivationFn(DERIVATION_PATHS.controlKey))
  const preRotatedControlKey = toBase64UrlSafe(
    derivationFn(DERIVATION_PATHS.preRotatedControlKey),
  )
  const encryptionKey = toBase64UrlSafe(derivationFn(DERIVATION_PATHS.encKey))
  const preRotatedEncryptionKey = toBase64UrlSafe(
    derivationFn(DERIVATION_PATHS.preRotatedEncKey),
  )

  const { id, encryptedWallet, inceptionEvent } = await getIcpFromKeySet({
    live_keys: JSON.stringify([controlKey, encryptionKey]),
    pre_rotated_keys: JSON.stringify([
      preRotatedControlKey,
      preRotatedEncryptionKey,
    ]),
    password: newPassword,
  })

  const keyProvider = await SoftwareKeyProvider.newEmptyWallet(
    impl,
    id,
    newPassword,
  )

  //@ts-ignore
  keyProvider._encryptedWallet = Buffer.from(encryptedWallet, 'base64')

  return {
    keyProvider,
    inceptionEvent: inceptionEvent,
  }
}

export const junMnemonicToEncryptedWallet = async (
  mnemonicPhrase: string,
  newPassword: string,
  didMethod: IDidMethod,
  impl: EncryptedWalletUtils,
) => {
  const seed = mnemonicToEntropy(mnemonicPhrase)
  const { keyProvider, inceptionEvent } = await recoverJunKeyProviderFromSeed(
    Buffer.from(seed, 'hex'),
    newPassword,
    impl,
  )

  await didMethod.registrar.encounter(inceptionEvent)

  return authAsIdentityFromKeyProvider(
    keyProvider,
    newPassword,
    didMethod.resolver,
  )
}
