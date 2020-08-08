import { SoftwareKeyProvider } from "@jolocom/vaulted-key-provider"
import { IdentityWallet } from "../identityWallet/identityWallet"
import { IResolver, IRegistrar } from "./types"

// TODO Figure out how to fit this into the DidMethod
// The function will be replaced by a more generic alternative once the new VKP is integrated
export const createIdentityFromKeyProvider = async (vaultedKeyProvider: SoftwareKeyProvider, decryptionPassword: string, registrar: IRegistrar) => {
  const identity = await registrar.create(
    vaultedKeyProvider,
    decryptionPassword
  )

  return new IdentityWallet({
    identity,
    vaultedKeyProvider,
    publicKeyMetadata: {
      signingKeyId: identity.didDocument.signer.keyId,
    }
  })
}

// TODO Figure out how to fit this into the DidMethod, a combination of a vkp and resolver
export const authAsIdentityFromKeyProvider = async (vkp: SoftwareKeyProvider, resolver: IResolver) => {
  const identity = await resolver.resolve(vkp.id)

  return new IdentityWallet({
    vaultedKeyProvider: vkp,
    identity,
    publicKeyMetadata: {
      signingKeyId: identity.didDocument.signer.keyId,
    }
  })
}

