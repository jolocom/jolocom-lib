export interface IPublicKeySectionAttrs {
  id: string
  type: string
  publicKeyHex: string
}

export interface IServiceEndpointSectionAttrs {
  id: string
  type: string
  serviceEndpoint: string
  description: string
}

export interface IAuthenticationSectionAttrs_v0 {
  publicKey: string
  type: string
}

export type IAuthenticationSectionAttrs = IPublicKeySectionAttrs | string
