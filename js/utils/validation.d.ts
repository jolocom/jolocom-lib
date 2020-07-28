import { IDigestable } from '../linkedDataSignature/types';
export declare const validateDigestable: (toValidate: IDigestable, resolver?: import("../didMethods/types").Resolver) => Promise<boolean>;
export declare const validateDigestables: (toValidate: IDigestable[], resolver?: import("../didMethods/types").Resolver) => Promise<boolean[]>;
