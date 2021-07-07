/// <reference types="node" />
import { IDigestable } from '../linkedDataSignature/types';
import { Identity } from '../identity/identity';
import { IResolver } from '../didMethods/types';
export declare type IdentityOrResolver = Identity | IResolver;
export declare const verifySignatureWithIdentity: (data: Buffer, signature: Buffer, signingKeyId: string, signer: Identity) => Promise<boolean>;
export declare const validateDigestable: (toValidate: IDigestable, resolverOrIdentity?: IdentityOrResolver) => Promise<boolean>;
export declare const validateDigestables: (toValidate: IDigestable[], resolverOrIdentity?: IdentityOrResolver) => Promise<boolean[]>;
