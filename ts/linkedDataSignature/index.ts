import { JsonLdObject } from "@jolocom/protocol-ts";
import { Identity } from "../identity/identity";
import { IdentityWallet } from "../identityWallet/identityWallet";
import { ProofDerivationOptions } from "./types";

type digestFn = (data: Buffer) => Buffer;
type normalizationFn = (data: JsonLdObject) => Promise<string>;
type encodingFn = (data: Buffer) => string
type decodingFn = (data: string) => Buffer

export enum SupportedSuites {
  ChainedProof2021 = "ChainedProof2021",
  EcdsaKoblitzSignature2016 = "EcdsaKoblitzSignature2016",
  Ed25519Signature2018 = "Ed25519Signature2018",
}

export type BaseProofOptions = {
  verificationMethod: string;
  proofPurpose?: string;
  created?: Date;
};

export abstract class LinkedDataProof<T extends BaseProofOptions> {
  abstract readonly proofType: SupportedSuites;

  protected _verificationMethod = "";
  protected _proofPurpose = "assertionMethod";

  protected _created: Date = new Date();
  protected _proofValue = "";

  abstract verificationMethod: string;
  abstract proofPurpose: string;
  abstract created: Date;

  abstract signatureSuite: {
    digestAlg: digestFn;
    normalizationFn: normalizationFn;
    signatureEncodingFn: encodingFn;
    signatureDecodingFn: decodingFn;
  };

  abstract derive(inputs:ProofDerivationOptions, customProofOptions: {}, signer: IdentityWallet, pass: string): Promise<LinkedDataProof<T>>;
  abstract verify(inputs: ProofDerivationOptions, signer: Identity): Promise<boolean>;
}
