import { IDigestable } from '../linkedDataSignature/types';
import { IRegistry } from '../registries/types';
export declare const validateDigestable: (toValidate: IDigestable, customRegistry?: IRegistry) => Promise<boolean>;
export declare const validateDigestables: (toValidate: IDigestable[], customRegistry?: IRegistry) => Promise<boolean[]>;
