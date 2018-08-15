export interface IPublicKeySectionAttrs {
  id: string
  type: string
  publicKeyHex: string
}

export interface IAuthenticationSectionAttrs {
  publicKey: string
  type: string
}

export interface IServiceEndpointSectionAttrs {
  id: string
  type: string
  serviceEndpoint: string
  description: string
}
