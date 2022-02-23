import { IdentityWallet } from '../../identityWallet/identityWallet';
import { SignedCredential } from './signedCredential';
import { Credential } from './credential';
import { LinkedDataProof, SupportedSuites, BaseProofOptions } from '../../linkedDataSignature';
import { ProofOptions } from '../../linkedDataSignature/types';
import { SuiteImplementation } from '../../linkedDataSignature/mapping';
import { ChainedProof2021, PreviousProofOptions } from '../../linkedDataSignature/suites/chainedProof2021';
import { SignedCredentialJSON } from './types';
declare type GenerateProofArgs<T extends SupportedSuites> = {
    proofOptions: ProofOptions;
    proofSpecificOptions: ExtendedSuites[T]['customArgs'];
};
declare type ExtendedSuites = typeof SuiteImplementation & {
    [SupportedSuites.ChainedProof2021]: {
        impl: typeof ChainedProof2021;
        customArgs: {
            chainSignatureSuite: SupportedSuites;
            previousProof: PreviousProofOptions;
        };
    };
};
export declare class CredentialSigner {
    private _credential;
    private _proofs;
    private issuanceMetadata;
    readonly proofs: LinkedDataProof<BaseProofOptions>[];
    private addProof;
    private addProofs;
    credential: Credential;
    setIssuer(issuer: string): this;
    setDates(issuance: Date, expiry: Date): this;
    generateAndSetDates(): this;
    generateProof<T extends SupportedSuites>(proofType: T, opts: GenerateProofArgs<T>, issuer: IdentityWallet, pass: string): Promise<LinkedDataProof<BaseProofOptions>>;
    private ensureReadyToIssue;
    toSignedCredential(): SignedCredential;
    static fromCredential(credential: Credential): CredentialSigner;
    static fromSignedCredential(vcOrJSON: SignedCredential | SignedCredentialJSON): CredentialSigner;
    private setCredential;
}
export {};
