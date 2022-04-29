/// <reference types="node" />
import { JsonLdObject, SignedJsonLdObject, JsonLdContext } from './types';
import { Identity } from '../identity/identity';
import { IResolver } from '../didMethods/types';
export declare const normalizeJsonLd: ({ ["@context"]: _, ...data }: JsonLdObject, context: JsonLdContext) => Promise<any>;
export declare const normalizeSignedLdObject: ({ proof, ["@context"]: _, ...data }: SignedJsonLdObject, context: JsonLdContext) => Promise<Buffer>;
export declare const digestJsonLd: (signedLdObject: SignedJsonLdObject, context: JsonLdContext) => Promise<Buffer>;
export declare const validateJsonLd: (json: SignedJsonLdObject, resolverOrIdentity?: IResolver | Identity) => Promise<boolean>;
