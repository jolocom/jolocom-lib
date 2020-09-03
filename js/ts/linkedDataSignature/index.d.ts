/// <reference types="node" />
import 'reflect-metadata';
import { LinkedDataSignatureSuite, ILinkedDataSignatureAttrs } from './types';
export declare class LinkedDataSignature {
    private _type;
    private _creator;
    private _created;
    private _nonce;
    private _signatureValue;
    created: Date;
    type: LinkedDataSignatureSuite;
    nonce: string;
    signature: string;
    creator: string;
    readonly signer: {
        did: string;
        keyId: string;
    };
    private normalize;
    asBytes(): Promise<Buffer>;
    static fromJSON(json: ILinkedDataSignatureAttrs): LinkedDataSignature;
    toJSON(): ILinkedDataSignatureAttrs;
}
