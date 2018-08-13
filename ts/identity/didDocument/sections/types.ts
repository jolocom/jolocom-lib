export interface IPublicKeySectionAttrs {
  id: string
  type: string
  publicKeyHex: string
}

export interface IAuthenticationSectionAttrs {
  id: string
  type: string
}

export interface IServiceEndpointSectionAttrs {
  id: string
  type: string
  serviceEndpoint: string
  description: string
}
