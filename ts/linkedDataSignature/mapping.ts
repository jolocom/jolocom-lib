import { SupportedSuites } from ".";
import { EcdsaLinkedDataSignature } from "./suites/ecdsaKoblitzSignature2016";

export const SuiteImplementation = {
  [SupportedSuites.EcdsaKoblitzSignature2016 as SupportedSuites]: {
    impl: EcdsaLinkedDataSignature,
    customArgs: {},
  },
};
