import { KeyTypes } from '../../ts/vaultedKeyProvider/types'

export const keyDerivationArgs = {
  derivationPath: KeyTypes.jolocomIdentityKey,
  encryptionPass: 'a'.repeat(32),
}
