import {
  IAuthenticationSectionAttrsv0,
  IAuthenticationSectionAttrs,
  IPublicKeySectionAttrs,
  IServiceEndpointSectionAttrs,
} from './sections/types'
import { ILinkedDataSignatureAttrs } from '../../linkedDataSignature/types'
import { ContextEntry } from 'cred-types-jolocom-core'
import { SignedJsonLdObject } from '../../validation/jsonLdValidator'

export interface IDidDocumentAttrs extends SignedJsonLdObject {
  '@context': ContextEntry[] | string
  specVersion?: number
  id: string
  authentication?:
    | IAuthenticationSectionAttrsv0[]
    | IAuthenticationSectionAttrs[]
  publicKey?: IPublicKeySectionAttrs[]
  service?: IServiceEndpointSectionAttrs[]
  created?: string
  proof: ILinkedDataSignatureAttrs
}
