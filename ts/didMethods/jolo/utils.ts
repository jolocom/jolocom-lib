import { KeyTypes } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider"
import { IdentityWallet } from "../../identityWallet/identityWallet"
import { jolocomContractsAdapter } from "../../contracts/contractsAdapter"
import { jolocomContractsGateway } from "../../contracts/contractsGateway"
import { publicKeyToDID } from "../../utils/crypto"
import { IResolver, IRegistrar } from "../types"
import { SoftwareKeyProvider } from "@jolocom/vaulted-key-provider"

// TODO Figure out how to fit this into the DidMethod
// The function will be replaced by a more generic alternative once the new VKP is integrated
export const createJoloIdentity = async (vaultedKeyProvider: SoftwareKeyProvider, decryptionPassword: string, registrar: IRegistrar) => {
  const identity = await registrar.create(
    vaultedKeyProvider,
    decryptionPassword
  )

  return new IdentityWallet({
    identity,
    vaultedKeyProvider,
    contractsAdapter: jolocomContractsAdapter,
    contractsGateway: jolocomContractsGateway,
  })
}

// TODO Figure out how to fit this into the DidMethod, a combination of a vkp and resolver
export const authJoloIdentity = async (vkp: SoftwareKeyProvider, password: string, resolver: IResolver) => {
  const identity = await resolver.resolve(vkp.id)

  return new IdentityWallet({
    vaultedKeyProvider: vkp,
    identity,
    contractsGateway: jolocomContractsGateway,
    contractsAdapter: jolocomContractsAdapter,
  })
}

