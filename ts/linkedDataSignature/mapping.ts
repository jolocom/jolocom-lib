import { SupportedSuites } from ".";
import { EcdsaLinkedDataSignature } from "./suites/ecdsaKoblitzSignature2016";
import { Ed25519Signature2018 } from "./suites/ed25519Signature2018";

export const SuiteImplementation = {
  [SupportedSuites.Ed25519Signature2018 as SupportedSuites]: {
    impl: Ed25519Signature2018,
    customArgs: {},
  },
  [SupportedSuites.EcdsaKoblitzSignature2016 as SupportedSuites]: {
    impl: EcdsaLinkedDataSignature,
    customArgs: {},
  },
};
