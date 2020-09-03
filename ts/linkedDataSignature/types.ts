import { KeyTypes } from '@jolocom/vaulted-key-provider'

export * from '@jolocom/protocol-ts/dist/lib/linkedDataSignature'

export interface IIDigestable {
  asBytes: () => Promise<Buffer>
  digest: () => Promise<Buffer>
  signer: {
    keyId: string
    did: string
  }
}

export enum LinkedDataSignatureSuite {
  Ed25519Signature2018 = "Ed25519Signature2018",
  EcdsaSecp256k1Signature2019 = "EcdsaSecp256k1Signature2019",
  EcdsaKoblitzSignature2016 = "EcdsaKoblitzSignature2016"
}

export enum JWA {
  ES256K,
  EdDSA,
}

export const getLDSignatureTypeByKeyType = (keyType: KeyTypes): LinkedDataSignatureSuite => {
  const keyTypeToLdSignatureSuite = {
    [KeyTypes.ecdsaSecp256k1VerificationKey2019]: LinkedDataSignatureSuite.EcdsaSecp256k1Signature2019,
    [KeyTypes.ecdsaSecp256k1RecoveryMethod2020]: LinkedDataSignatureSuite.EcdsaSecp256k1Signature2019,
    [KeyTypes.ed25519VerificationKey2018]: LinkedDataSignatureSuite.Ed25519Signature2018,
  }

  return keyTypeToLdSignatureSuite[keyType]
}
