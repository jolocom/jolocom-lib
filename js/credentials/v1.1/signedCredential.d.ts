import 'reflect-metadata';
import { LinkedDataProof, BaseProofOptions } from '../../linkedDataSignature';
import { Credential } from './credential';
import { BaseMetadata, IClaimSection, ISignedCredCreationArgs, JsonLdContext } from '@jolocom/protocol-ts';
import { SignedCredentialJSON } from './types';
interface IIssInfo {
    keyId: string;
    issuerDid: string;
}
export declare class SignedCredential {
    readonly credential: Credential;
    private _issuer;
    private _issued;
    private _expires?;
    private _proof;
    private _credentialSchema?;
    credentialSubject: IClaimSection;
    context: JsonLdContext;
    id: string;
    issuer: string;
    issued: Date;
    expires: Date;
    type: string[];
    credentialSchema: Array<{
        id: string;
        type: string;
    }>;
    proof: Array<LinkedDataProof<BaseProofOptions>>;
    addProof(proof: LinkedDataProof<BaseProofOptions>): void;
    subject: string;
    static create<T extends BaseMetadata>(credentialOptions: ISignedCredCreationArgs<T>, issInfo: IIssInfo, expires?: Date): Promise<SignedCredential>;
    static fromJSON(json: SignedCredentialJSON): SignedCredential;
    toJSON(): SignedCredentialJSON;
}
export {};
