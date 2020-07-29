import { IVaultedKeyProvider, KeyTypes } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider"
import { IdentityWallet } from "../../identityWallet/identityWallet"
import { jolocomContractsAdapter } from "../../contracts/contractsAdapter"
import { jolocomContractsGateway } from "../../contracts/contractsGateway"
import { publicKeyToDID } from "../../utils/crypto"
import { Resolver, Registrar } from "../types"

// TODO Figure out how to fit this into the DidMethod
// The function will be replaced by a more generic alternative once the new VKP is integrated
export const createJoloIdentity = async (vaultedKeyProvider: IVaultedKeyProvider, decryptionPassword: string, registrar: Registrar) => {
  const identity = await registrar.create(
    vaultedKeyProvider,
    decryptionPassword
  )

  return new IdentityWallet({
    identity,
    vaultedKeyProvider,
    publicKeyMetadata: {
      derivationPath: KeyTypes.jolocomIdentityKey,
      keyId: identity.didDocument.signer.keyId,
    },
    contractsAdapter: jolocomContractsAdapter,
    contractsGateway: jolocomContractsGateway,
  })
}

// TODO Figure out how to fit this into the DidMethod, a combination of a vkp and resolver
export const authJoloIdentity = async (vkp: IVaultedKeyProvider, password: string, resolver: Resolver) => {
  // TODO Once the new VKP is integrated, we can get the DID directly it's profile / state.
  const publicIdentityKey = vkp.getPublicKey({
    derivationPath: KeyTypes.jolocomIdentityKey,
    encryptionPass: password
  })

  const did = publicKeyToDID(publicIdentityKey)

  const identity = await resolver.resolve(did)

  // TODO Once the new vkp is integrated, we can get this from the profile / state
  const publicKeyMetadata = {
    derivationPath: KeyTypes.jolocomIdentityKey,
    keyId: identity.didDocument.signer.keyId,
  }

  return new IdentityWallet({
    vaultedKeyProvider: vkp,
    identity,
    publicKeyMetadata,
    contractsGateway: jolocomContractsGateway,
    contractsAdapter: jolocomContractsAdapter,
  })
}

