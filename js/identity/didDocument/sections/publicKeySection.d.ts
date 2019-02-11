/// <reference types="node" />
import 'reflect-metadata';
import { IPublicKeySectionAttrs } from './types';
export declare class PublicKeySection {
    private _id;
    private _type;
    private _owner;
    private _publicKeyHex;
    owner: string;
    id: string;
    type: string;
    publicKeyHex: string;
    static fromEcdsa(publicKey: Buffer, id: string, did: string): PublicKeySection;
    toJSON(): IPublicKeySectionAttrs;
    fromJSON(json: IPublicKeySectionAttrs): PublicKeySection;
}
