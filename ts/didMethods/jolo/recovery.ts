import {
  EncryptedWalletUtils,
  SoftwareKeyProvider,
  KeyTypes,
} from '@jolocom/vaulted-key-provider'
import { sliceSeedPhrase } from '../../recovery/recovery'
import { KEY_PATHS, KEY_REFS } from './constants'
import { fromSeed, validateMnemonic } from 'bip32'
import { publicKeyToJoloDID } from './utils'
import { authAsIdentityFromKeyProvider } from '../utils'
import { IDidMethod } from '../types'

const { JOLO_DERIVATION_PATH, ETH_DERIVATION_PATH } = KEY_PATHS
const { SIGNING_KEY_REF, ENCRYPTION_KEY_REF, ANCHOR_KEY_REF } = KEY_REFS

export const recoverJoloKeyProviderFromSeed = async (
  seed: Buffer,
  newPassword: string,
  impl: EncryptedWalletUtils,
  originalDid?: string,
): Promise<SoftwareKeyProvider> => {
  const joloKeys = fromSeed(seed).derivePath(JOLO_DERIVATION_PATH)
  const ethKeys = fromSeed(seed).derivePath(ETH_DERIVATION_PATH)
  const did = originalDid || publicKeyToJoloDID(joloKeys.publicKey)

  const skp = await SoftwareKeyProvider.newEmptyWallet(impl, did, newPassword)

  await skp.changeId(newPassword, did)

  await skp.addContent(newPassword, {
    type: ['BIP32JolocomIdentitySeedv0'],
    value: seed.toString('hex'),
  })

  await skp.addContent(newPassword, {
    controller: [`${did}#${SIGNING_KEY_REF}`],
    type: KeyTypes.ecdsaSecp256k1VerificationKey2019,
    publicKeyHex: joloKeys.publicKey.toString('hex'),
    private_key: joloKeys.privateKey.toString('hex'),
  })

  await skp.addContent(newPassword, {
    controller: [`${did}#${ANCHOR_KEY_REF}`],
    type: KeyTypes.ecdsaSecp256k1RecoveryMethod2020,
    publicKeyHex: ethKeys.publicKey.toString('hex'),
    private_key: ethKeys.privateKey.toString('hex'),
  })

  await skp.newKeyPair(
    newPassword,
    //@ts-ignore Investigate further, using the enum value
    //leads to failure to downcast to string in rust
    'X25519KeyAgreementKey2019',
    `${did}#${ENCRYPTION_KEY_REF}`,
  )

  return skp
}
