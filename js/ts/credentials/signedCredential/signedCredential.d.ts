/// <reference types="node" />
import 'reflect-metadata';
import { ISignedCredCreationArgs, ISignedCredentialAttrs, ISigner } from './types';
import { IDigestable } from '../../linkedDataSignature/types';
import { BaseMetadata } from '@jolocom/protocol-ts';
import { IClaimSection } from '../credential/types';
import { LinkedDataSignature } from '../../linkedDataSignature/index';
import { JsonLdContext } from '../../linkedData/types';
import { IdentityWallet } from '../../identityWallet/identityWallet';
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
    proof: LinkedDataSignature;
    subject: string;
    claim: IClaimSection;
    name: string;
    static create<T extends BaseMetadata>(credentialOptions: ISignedCredCreationArgs<T>, expires?: Date): Promise<SignedCredential>;
    sign(identityWallet: IdentityWallet, password: string): Promise<void>;
    asBytes(): Promise<Buffer>;
    digest(): Promise<Buffer>;
    static fromJSON(json: ISignedCredentialAttrs): SignedCredential;
    toJSON(): ISignedCredentialAttrs;
}
