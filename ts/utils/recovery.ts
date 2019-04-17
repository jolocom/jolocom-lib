import { JolocomRegistry } from '../registries/jolocomRegistry'
import { mnemonicToEntropy, validateMnemonic } from 'bip39'
import { IdentityWallet } from '../identityWallet/identityWallet'
import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { KeyTypes, IVaultedKeyProvider } from '../vaultedKeyProvider/types'

/**
 * Recovers the identity key pair based on a the mnemonic phrase
 * @param seedPhrase - The recovery phrase of the original seed
 * @param registry - jolocom registry to resolve the identity that should be recovered
 * @param password - The password for the key provider
 * @returns The identityWallet and the key provider
 */
export async function recoverIdentity(
  seedPhrase: string,
  registry: JolocomRegistry,
  password: string,
): Promise<{
  identityWallet: IdentityWallet
  vaultedKeyProvider: IVaultedKeyProvider
}> {
  if (!validateMnemonic(seedPhrase)) throw new Error('Invalid Seed Phrase!')
  const entropy = mnemonicToEntropy(seedPhrase)

  const userVault = new SoftwareKeyProvider(
    Buffer.from(entropy, 'hex'),
    password,
  )

  const wallet = await registry.authenticate(userVault, {
    derivationPath: KeyTypes.jolocomIdentityKey,
    encryptionPass: password,
  })

  return {
    identityWallet: wallet,
    vaultedKeyProvider: userVault,
  }
}
