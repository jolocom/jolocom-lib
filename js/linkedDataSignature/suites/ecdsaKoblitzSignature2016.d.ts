/// <reference types="node" />
import 'reflect-metadata';
import { ILinkedDataSignature, ILinkedDataSignatureAttrs, IDigestable } from '../types';
export declare class EcdsaLinkedDataSignature implements ILinkedDataSignature, IDigestable {
    private _type;
    private _creator;
    private _created;
    private _nonce;
    private _signatureValue;
    created: Date;
    type: string;
    nonce: string;
    signature: string;
    creator: string;
    readonly signer: {
        did: string;
        keyId: string;
    };
    private normalize;
    asBytes(): Promise<Buffer>;
    digest(): Promise<Buffer>;
    static fromJSON(json: ILinkedDataSignatureAttrs): EcdsaLinkedDataSignature;
    toJSON(): ILinkedDataSignatureAttrs;
}
