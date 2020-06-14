import {
  IPublicKeySectionAttrs,
  IAuthenticationSectionAttrs,
  IServiceEndpointSectionAttrs,
} from './sections/types'
import { SignedJsonLdObject } from '../../linkedData/types'

export interface IDidDocumentAttrs extends SignedJsonLdObject {
  id: string
  authentication: IAuthenticationSectionAttrs[]
  publicKey: IPublicKeySectionAttrs[]
  service: IServiceEndpointSectionAttrs[]
  created: string
}
