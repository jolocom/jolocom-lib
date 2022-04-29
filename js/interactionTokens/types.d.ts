export * from '@jolocom/protocol-ts/dist/lib/interactionTokens';
export declare enum SupportedJWA {
    ES256KR = "ES256K-R",
    ES256K = "ES256K",
    EdDSA = "EdDSA"
}
export declare const KeyTypeToJWA: {
    EcdsaSecp256k1VerificationKey2019: SupportedJWA;
    EcdsaSecp256k1RecoveryMethod2020: SupportedJWA;
    Ed25519VerificationKey2018: SupportedJWA;
};
