import {
  IAuthenticationSectionAttrsv0,
  IAuthenticationSectionAttrs,
  IPublicKeySectionAttrs,
  IServiceEndpointSectionAttrs,
} from './sections/types'
import { ILinkedDataSignatureAttrs } from '@jolocom/protocol-ts/dist/lib/linkedDataSignature'
import { ContextEntry } from '@jolocom/protocol-ts'

export interface IDidDocumentAttrs {
  '@context': ContextEntry[] | string
  specVersion?: number
  id: string
  authentication?:
    | IAuthenticationSectionAttrsv0[]
    | IAuthenticationSectionAttrs[]
  publicKey?: IPublicKeySectionAttrs[]
  service?: IServiceEndpointSectionAttrs[]
  created?: string
  proof?: ILinkedDataSignatureAttrs
}
