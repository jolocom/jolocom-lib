import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'
import { IdentityWallet } from '../identityWallet/identityWallet'
import { IResolver, IRegistrar } from './types'
import { mapPublicKeys } from '../utils/helper'

// TODO Figure out how to fit this into the DidMethod
// The function will be replaced by a more generic alternative once the new VKP is integrated
export const createIdentityFromKeyProvider = async (
  vaultedKeyProvider: SoftwareKeyProvider,
  decryptionPassword: string,
  registrar: IRegistrar,
) => {
  const identity = await registrar.create(
    vaultedKeyProvider,
    decryptionPassword,
  )

  return new IdentityWallet({
    identity,
    vaultedKeyProvider,
    publicKeyMetadata: await mapPublicKeys(
      identity,
      vaultedKeyProvider,
      decryptionPassword,
    ),
  })
}

// TODO Figure out how to fit this into the DidMethod, a combination of a vkp and resolver
export const authAsIdentityFromKeyProvider = async (
  vkp: SoftwareKeyProvider,
  resolver: IResolver,
  pass: string,
) => {
  const identity = await resolver.resolve(vkp.id)

  return new IdentityWallet({
    vaultedKeyProvider: vkp,
    identity,
    publicKeyMetadata: await mapPublicKeys(identity, vkp, pass),
  })
}
