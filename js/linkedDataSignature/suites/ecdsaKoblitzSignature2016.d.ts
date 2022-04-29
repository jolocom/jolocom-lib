/// <reference types="node" />
import 'reflect-metadata';
import { ILinkedDataSignature, ILinkedDataSignatureAttrs, IDigestable } from '../types';
export declare class EcdsaLinkedDataSignature implements ILinkedDataSignature, IDigestable {
    private _type;
    private _creator;
    private _created;
    private _nonce;
    private _signatureValue;
    get created(): Date;
    set created(created: Date);
    get type(): string;
    set type(type: string);
    get nonce(): string;
    set nonce(nonce: string);
    get signature(): string;
    set signature(signature: string);
    get creator(): string;
    set creator(creator: string);
    get signer(): {
        did: string;
        keyId: string;
    };
    private normalize;
    asBytes(): Promise<Buffer>;
    digest(): Promise<Buffer>;
    static fromJSON(json: ILinkedDataSignatureAttrs): EcdsaLinkedDataSignature;
    toJSON(): ILinkedDataSignatureAttrs;
}
