import { JsonLdObject } from '../../../validation/jsonLdValidator'

export interface IPublicKeySectionAttrs extends JsonLdObject {
  id: string
  type: string
  publicKeyHex: string
}

export interface IAuthenticationSectionAttrsv0 extends JsonLdObject {
  publicKey: string
  type: string
}

export interface IServiceEndpointSectionAttrs extends JsonLdObject {
  id: string
  type: string
  serviceEndpoint: string
  description: string
}

export type IAuthenticationSectionAttrs = IPublicKeySectionAttrs | string
