/// <reference types="node" />
import 'reflect-metadata';
import { IPublicKeySectionAttrs } from './types';
export declare class PublicKeySection {
    private _id;
    private _type;
    private _controller;
    private _publicKeyHex;
    controller: string;
    id: string;
    type: string;
    publicKeyHex: string;
    static fromEcdsa(publicKey: Buffer, id: string, did: string): PublicKeySection;
    static fromX25519(publicKey: Buffer, id: string, did: string): PublicKeySection;
    toJSON(): IPublicKeySectionAttrs;
    fromJSON(json: IPublicKeySectionAttrs): PublicKeySection;
}
