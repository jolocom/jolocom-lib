import 'reflect-metadata';
import { ILinkedDataSignatureAttrs, ProofDerivationOptions } from '../types';
import { IdentityWallet } from '../../identityWallet/identityWallet';
import { LinkedDataProof, SupportedSuites, BaseProofOptions } from '..';
import { Identity } from '../../identity/identity';
export declare enum ErrorCodes {
    InnerSignatureVerificationFailed = "InnerSignatureVerificationFailed",
    ChainAndInnerSignatureVerificationFailed = "ChainAndInnerSignatureVerificationFailed"
}
declare type customProofOptions = {
    chainSignatureSuite: SupportedSuites;
    previousProof: PreviousProofOptions;
    strict?: boolean;
};
export declare type PreviousProofOptions = {
    type: SupportedSuites;
    verificationMethod: string;
    created: Date;
    proofPurpose: string;
    domain?: string;
};
export declare class ChainedProof2021<T extends BaseProofOptions> extends LinkedDataProof<T> {
    proofType: SupportedSuites;
    signatureSuite: {
        hashFn: any;
        normalizeFn: any;
        encodeSignature: any;
        decodeSignature: any;
    };
    private _previousProof;
    private _chainSignatureSuite;
    chainSignatureSuite: SupportedSuites;
    created: Date;
    type: SupportedSuites;
    previousProof: PreviousProofOptions;
    proofPurpose: string;
    signature: string;
    verificationMethod: string;
    static create<T extends BaseProofOptions>(args: T): LinkedDataProof<T>;
    derive(inputs: ProofDerivationOptions, customProofOptions: customProofOptions, signer: IdentityWallet, pass: string): Promise<this>;
    verify(inputs: ProofDerivationOptions, signer: Identity, additionalSigners?: Array<Identity>): Promise<boolean>;
    private createVerifyHash;
    private findMatchingProof;
    static fromJSON(json: ILinkedDataSignatureAttrs): ChainedProof2021<BaseProofOptions>;
    toJSON(): ILinkedDataSignatureAttrs;
}
export {};
