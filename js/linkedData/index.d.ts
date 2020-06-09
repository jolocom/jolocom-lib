/// <reference types="node" />
import { ILinkedDataSignatureAttrs } from '../linkedDataSignature/types';
import { IRegistry } from '../registries/types';
import { JsonLdObject, SignedJsonLdObject, JsonLdContext } from './types';
export declare const normalizeJsonLd: ({ ["@context"]: _, ...data }: JsonLdObject, context: JsonLdContext) => Promise<any>;
export declare const normalizeLdProof: ({ signatureValue, id, type, ...toNormalize }: ILinkedDataSignatureAttrs, context: JsonLdContext) => Promise<string>;
export declare const digestJsonLd: ({ proof, ["@context"]: _, ...data }: SignedJsonLdObject, context: JsonLdContext) => Promise<Buffer>;
export declare const validateJsonLd: (json: SignedJsonLdObject, customRegistry?: IRegistry | {
    [key: string]: any;
}) => Promise<boolean>;
