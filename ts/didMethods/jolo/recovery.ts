import {
  EncryptedWalletUtils,
  SoftwareKeyProvider,
  KeyTypes,
} from '@jolocom/vaulted-key-provider'
import { KEY_PATHS, KEY_REFS } from './constants'
import { fromMasterSeed } from 'hdkey'
import { publicKeyToJoloDID } from './utils'

const { JOLO_DERIVATION_PATH, ETH_DERIVATION_PATH } = KEY_PATHS
const { SIGNING_KEY_REF, ENCRYPTION_KEY_REF, ANCHOR_KEY_REF } = KEY_REFS

export const recoverJoloKeyProviderFromSeed = async (
  seed: Buffer,
  newPassword: string,
  impl: EncryptedWalletUtils,
  originalDid?: string,
): Promise<SoftwareKeyProvider> => {
  const joloKeys = fromMasterSeed(seed).derive(JOLO_DERIVATION_PATH)
  const ethKeys = fromMasterSeed(seed).derive(ETH_DERIVATION_PATH)
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
