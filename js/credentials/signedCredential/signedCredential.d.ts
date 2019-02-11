/// <reference types="node" />
import 'reflect-metadata';
import { ISignedCredentialAttrs, ISignedCredCreationArgs } from './types';
import { ILinkedDataSignature, IDigestable } from '../../linkedDataSignature/types';
import { ContextEntry, BaseMetadata } from 'cred-types-jolocom-core';
import { IClaimSection } from '../credential/types';
import { ISigner } from '../../registries/types';
interface IIssInfo {
    keyId: string;
    issuerDid: string;
}
export declare class SignedCredential implements IDigestable {
    private '_@context';
    private _id;
    private _name;
    private _issuer;
    private _type;
    private _claim;
    private _issued;
    private _expires?;
    private _proof;
    context: ContextEntry[];
    id: string;
    issuer: string;
    issued: Date;
    type: string[];
    signature: string;
    readonly signer: ISigner;
    expires: Date;
    proof: ILinkedDataSignature;
    subject: string;
    claim: IClaimSection;
    name: string;
    static create<T extends BaseMetadata>(credentialOptions: ISignedCredCreationArgs<T>, issInfo: IIssInfo): Promise<SignedCredential>;
    private prepareSignature;
    digest(): Promise<Buffer>;
    private normalize;
    static fromJSON(json: ISignedCredentialAttrs): SignedCredential;
    toJSON(): ISignedCredentialAttrs;
}
export {};
