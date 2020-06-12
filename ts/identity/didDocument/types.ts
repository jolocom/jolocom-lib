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

// Created is present here but not in the DIDDocument interface
// Context is a string in DIDDocument and a nested whatever here
