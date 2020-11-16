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
    context: JsonLdContext;
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
    static create<T extends BaseMetadata>(credentialOptions: ISignedCredCreationArgs<T>, issInfo: IIssInfo, expires?: Date): Promise<SignedCredential>;
    private prepareSignature;
    asBytes(): Promise<Buffer>;
    digest(): Promise<Buffer>;
    static fromJSON(json: ISignedCredentialAttrs): SignedCredential;
    toJSON(): ISignedCredentialAttrs;
}
export {};
