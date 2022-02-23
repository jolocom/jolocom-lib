import { EcdsaLinkedDataSignature } from "./suites/ecdsaKoblitzSignature2016";
import { Ed25519Signature2018 } from "./suites/ed25519Signature2018";
export declare const SuiteImplementation: {
    [x: string]: {
        impl: typeof Ed25519Signature2018;
        customArgs: {};
    } | {
        impl: typeof EcdsaLinkedDataSignature;
        customArgs: {};
    };
};
