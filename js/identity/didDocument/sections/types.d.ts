import { JsonLdObject } from '../../../linkedData/types';
export interface IPublicKeySectionAttrs extends JsonLdObject {
    id: string;
    type: string;
    publicKeyHex: string;
}
export interface IServiceEndpointSectionAttrs extends JsonLdObject {
    id: string;
    type: string;
    serviceEndpoint: string;
    description: string;
}
export interface IAuthenticationSectionAttrsv0 {
    publicKey: string;
    type: string;
}
export declare type IAuthenticationSectionAttrs = IPublicKeySectionAttrs | string;
