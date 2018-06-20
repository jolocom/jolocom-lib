import { IPublicKeySectionAttrs, IAuthenticationSectionAttrs, IServiceEndpointSectionAttrs  } from './sections/types'

export interface IDidDocumentAttrs {
  '@context': string
  id: string
  authentication: IAuthenticationSectionAttrs
  publicKey: IPublicKeySectionAttrs
  serviceEndpoints: IServiceEndpointSectionAttrs
  created: Date
}
