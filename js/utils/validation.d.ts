import { IDigestable } from '../linkedDataSignature/types';
import { Resolver } from 'did-resolver';
export declare const validateDigestable: (toValidate: IDigestable, customResolver?: Resolver) => Promise<boolean>;
export declare const validateDigestables: (toValidate: IDigestable[], customResolver?: Resolver) => Promise<boolean[]>;
