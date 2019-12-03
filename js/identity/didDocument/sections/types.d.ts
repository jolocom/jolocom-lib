import { JsonLdObject } from '../../../linkedData/types';
export interface IPublicKeySectionAttrs extends JsonLdObject {
    id: string;
    type: string;
    publicKeyHex: string;
}
export interface IAuthenticationSectionAttrs extends JsonLdObject {
    publicKey: string;
    type: string;
}
export interface IServiceEndpointSectionAttrs extends JsonLdObject {
    id: string;
    type: string;
    serviceEndpoint: string;
    description: string;
}
