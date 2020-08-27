import { SoftwareKeyProvider, EncryptedWalletUtils } from '@jolocom/vaulted-key-provider'
import { validateEvents, getIcpFromKeySet } from '@jolocom/native-core'
import { derivePath } from '@hawkingnetwork/ed25519-hd-key-rn'
import { Identity } from '../../identity/identity'
import { DidDocument } from '../../identity/didDocument/didDocument'
import { IRegistrar } from '../types'

const DERIVATION_PATHS = {
  // TODO Change back
  controlKey: "m/73'/0'/0'",
  preRotatedControlKey: "m/73'/0'/1'",
  encKey: "m/73'/1'/0'",
  preRotatedEncKey: "m/73'/1'/1'"
}

const toBase64UrlSafe = (toEncode: Buffer) => {
  const b64 = toEncode.toString('base64');
  return b64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export const slip10DeriveKey = (seed: Buffer) => (path: String): Buffer => {
  return derivePath(path, seed).key
}

export const recoverIdentityFromSlip0010Seed = async (
  seed: Buffer,
  newPassword: string,
  impl: EncryptedWalletUtils,
  registrar?: IRegistrar
) => {
  const derivationFn = slip10DeriveKey(seed)

  const controlKey = toBase64UrlSafe(derivationFn(DERIVATION_PATHS.controlKey))
  const preRotatedControlKey = toBase64UrlSafe(derivationFn(DERIVATION_PATHS.preRotatedControlKey))
  const encryptionKey = toBase64UrlSafe(derivationFn(DERIVATION_PATHS.encKey))
  const preRotatedEncryptionKey = toBase64UrlSafe(derivationFn(DERIVATION_PATHS.preRotatedEncKey))

  const { id, encryptedWallet, inceptionEvent } = await getIcpFromKeySet({
    live_keys: JSON.stringify([controlKey, encryptionKey]),
    pre_rotated_keys: JSON.stringify([preRotatedControlKey, preRotatedEncryptionKey]),
    password: newPassword
  })

  const vkp = await SoftwareKeyProvider.newEmptyWallet(impl, id, newPassword)

  //@ts-ignore
  vkp._encryptedWallet = Buffer.from(encryptedWallet, 'base64')

  const didDoc = JSON.parse(
    await validateEvents(JSON.stringify([inceptionEvent])),
  )

  const identity = Identity.fromDidDocument({
    didDocument: DidDocument.fromJSON(didDoc),
  })

  registrar && await registrar.encounter([inceptionEvent])
  return identity
}

