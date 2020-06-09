import { IDigestable } from '../linkedDataSignature/types';
import { IRegistry } from '../registries/types';
import { Resolver, DIDResolver } from 'did-resolver';
export declare const validateDigestable: (toValidate: IDigestable, customRegistry?: IRegistry | {
    [key: string]: any;
}) => Promise<boolean>;
export declare const validateDigestables: (toValidate: IDigestable[], customRegistry?: IRegistry | {
    [key: string]: any;
}) => Promise<boolean[]>;
declare type ResolverMap = {
    [key: string]: DIDResolver;
};
export declare const createResolver: <T extends IRegistry | ResolverMap>(resolverBase?: T) => Resolver;
export {};
