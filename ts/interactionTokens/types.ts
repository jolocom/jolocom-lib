import { KeyTypes } from '@jolocom/vaulted-key-provider'

export * from '@jolocom/protocol-ts/dist/lib/interactionTokens'

export enum SupportedJWA {
  ES256KR = "ES256K-R",
  ES256K = "ES256K",
  EdDSA = "EdDSA"
}

export const KeyTypeToJWA = {
  [KeyTypes.ecdsaSecp256k1VerificationKey2019]: SupportedJWA.ES256K,
  [KeyTypes.ecdsaSecp256k1RecoveryMethod2020]: SupportedJWA.ES256KR,
  [KeyTypes.ed25519VerificationKey2018]: SupportedJWA.EdDSA
}
