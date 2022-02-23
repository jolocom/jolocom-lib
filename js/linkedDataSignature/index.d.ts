/// <reference types="node" />
import { JsonLdObject } from "@jolocom/protocol-ts";
import { Identity } from "../identity/identity";
import { IdentityWallet } from "../identityWallet/identityWallet";
import { ProofDerivationOptions } from "./types";
declare type digestFn = (data: Buffer) => Buffer;
declare type normalizationFn = (data: JsonLdObject) => Promise<string>;
declare type encodingFn = (data: Buffer) => string;
declare type decodingFn = (data: string) => Buffer;
export declare enum SupportedSuites {
    ChainedProof2021 = "ChainedProof2021",
    EcdsaKoblitzSignature2016 = "EcdsaKoblitzSignature2016",
    Ed25519Signature2018 = "Ed25519Signature2018"
}
export declare type BaseProofOptions = {
    verificationMethod: string;
    proofPurpose?: string;
    created?: Date;
};
export declare abstract class LinkedDataProof<T extends BaseProofOptions> {
    abstract readonly proofType: SupportedSuites;
    protected _verificationMethod: string;
    protected _proofPurpose: string;
    protected _created: Date;
    protected _proofValue: string;
    abstract verificationMethod: string;
    abstract proofPurpose: string;
    abstract created: Date;
    abstract signatureSuite: {
        hashFn: digestFn;
        normalizeFn: normalizationFn;
        encodeSignature: encodingFn;
        decodeSignature: decodingFn;
    };
    abstract derive(inputs: ProofDerivationOptions, customProofOptions: {}, signer: IdentityWallet, pass: string): Promise<LinkedDataProof<T>>;
    abstract verify(inputs: ProofDerivationOptions, signer: Identity, additionalSigners?: Identity[]): Promise<boolean>;
}
export {};
