import {
  IAuthenticationSectionAttrsv0,
  IAuthenticationSectionAttrs,
  PublicKeySectionAttrs,
  IServiceEndpointSectionAttrs,
} from './sections/types'
import { ILinkedDataSignatureAttrs } from '../../linkedDataSignature/types'
import { SignedJsonLdObject } from '../../validation/jsonLdValidator'

export interface IDidDocumentAttrs extends SignedJsonLdObject {
  specVersion?: number
  id: string
  authentication?: DidDocAuthenticationSection
  publicKey?: PublicKeySectionAttrs[]
  service?: IServiceEndpointSectionAttrs[]
  created?: string
  proof: ILinkedDataSignatureAttrs
}

export type DidDocAuthenticationSection =
  | IAuthenticationSectionAttrsv0[]
  | IAuthenticationSectionAttrs[]
