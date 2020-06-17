import { ILinkedDataSignatureAttrs } from '../linkedDataSignature/types';
import { ContextEntry } from 'jolocom-protocol-ts';
declare type JsonLdPrimitive = string | number | boolean | JsonLdObject | JsonLdObject[];
export declare type JsonLdContext = ContextEntry | ContextEntry[];
export interface JsonLdObject {
    '@context'?: JsonLdContext;
    [key: string]: JsonLdPrimitive | JsonLdPrimitive[];
}
export interface SignedJsonLdObject extends JsonLdObject {
    proof: ILinkedDataSignatureAttrs;
}
export {};
