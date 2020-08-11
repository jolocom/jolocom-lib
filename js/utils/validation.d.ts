/// <reference types="node" />
import { IDigestable } from '../linkedDataSignature/types';
import { KeyTypes } from '@jolocom/vaulted-key-provider';
export declare const verifySignature: (data: Buffer, signature: Buffer, pKey: Buffer, keyType: KeyTypes) => Promise<boolean>;
export declare const validateDigestable: (toValidate: IDigestable, resolver?: import("../didMethods/types").IResolver) => Promise<boolean>;
export declare const validateDigestables: (toValidate: IDigestable[], resolver?: import("../didMethods/types").IResolver) => Promise<boolean[]>;
