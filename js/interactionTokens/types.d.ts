import { KeyTypes } from '@jolocom/vaulted-key-provider';
export * from '@jolocom/protocol-ts/dist/lib/interactionTokens';
export declare enum SupportedJWA {
    ES256KR = "ES256K-R",
    ES256K = "ES256K",
    EdDSA = "EdDSA"
}
export declare const KeyTypeToJWA: {
    [KeyTypes.ecdsaSecp256k1VerificationKey2019]: SupportedJWA;
    [KeyTypes.ecdsaSecp256k1RecoveryMethod2020]: SupportedJWA;
    [KeyTypes.ed25519VerificationKey2018]: SupportedJWA;
};
