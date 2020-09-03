/// <reference types="node" />
import { KeyTypes } from '@jolocom/vaulted-key-provider';
export * from '@jolocom/protocol-ts/dist/lib/linkedDataSignature';
export interface IIDigestable {
    asBytes: () => Promise<Buffer>;
    digest: () => Promise<Buffer>;
    signer: {
        keyId: string;
        did: string;
    };
}
export declare enum LinkedDataSignatureSuite {
    Ed25519Signature2018 = "Ed25519Signature2018",
    EcdsaSecp256k1Signature2019 = "EcdsaSecp256k1Signature2019",
    EcdsaKoblitzSignature2016 = "EcdsaKoblitzSignature2016"
}
export declare enum JWA {
    ES256K = 0,
    EdDSA = 1
}
export declare const getLDSignatureTypeByKeyType: (keyType: KeyTypes) => LinkedDataSignatureSuite;
