import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'
import { IdentityWallet } from '../identityWallet/identityWallet'
import { IResolver, IRegistrar } from './types'
import { mapPublicKeys } from '../utils/helper'
import { IdentityOrResolver } from '../utils/validation'
import { Identity } from '../identity/identity'

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

  const vaultKeys = await vaultedKeyProvider.getPubKeys(decryptionPassword)

  return new IdentityWallet({
    identity,
    vaultedKeyProvider,
    publicKeyMetadata: await mapPublicKeys(
      identity,
      vaultKeys
    ),
  })
}

// TODO Figure out how to fit this into the DidMethod, a combination of a vkp and resolver
export const authAsIdentityFromKeyProvider = async (
  vkp: SoftwareKeyProvider,
  pass: string,
  identityOrResolver: IdentityOrResolver,
) => {
  const identity = identityOrResolver instanceof Identity
    ?  identityOrResolver
      : await identityOrResolver.resolve(vkp.id)

  const vaultKeys = await vkp.getPubKeys(pass)

  return new IdentityWallet({
    vaultedKeyProvider: vkp,
    identity,
    publicKeyMetadata: await mapPublicKeys(identity, vaultKeys),
  })
}
