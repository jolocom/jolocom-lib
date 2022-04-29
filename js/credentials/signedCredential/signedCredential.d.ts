/// <reference types="node" />
import 'reflect-metadata';
import { ISignedCredCreationArgs, ISignedCredentialAttrs, ISigner } from './types';
import { IDigestable, ILinkedDataSignature } from '../../linkedDataSignature/types';
import { BaseMetadata } from '@jolocom/protocol-ts';
import { IClaimSection } from '../credential/types';
import { JsonLdContext } from '../../linkedData/types';
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
    get context(): JsonLdContext;
    set context(context: JsonLdContext);
    get id(): string;
    set id(id: string);
    get issuer(): string;
    set issuer(issuer: string);
    get issued(): Date;
    set issued(issued: Date);
    get type(): string[];
    set type(type: string[]);
    get signature(): string;
    set signature(signature: string);
    get signer(): ISigner;
    get expires(): Date;
    set expires(expiry: Date);
    get proof(): ILinkedDataSignature;
    set proof(proof: ILinkedDataSignature);
    get subject(): string;
    set subject(subject: string);
    get claim(): IClaimSection;
    set claim(claim: IClaimSection);
    get name(): string;
    set name(name: string);
    static create<T extends BaseMetadata>(credentialOptions: ISignedCredCreationArgs<T>, issInfo: IIssInfo, expires?: Date): Promise<SignedCredential>;
    private prepareSignature;
    asBytes(): Promise<Buffer>;
    digest(): Promise<Buffer>;
    static fromJSON(json: ISignedCredentialAttrs): SignedCredential;
    toJSON(): ISignedCredentialAttrs;
}
export {};
