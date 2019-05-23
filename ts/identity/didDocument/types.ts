import {
  IPublicKeySectionAttrs,
  IServiceEndpointSectionAttrs,
} from './sections/types'
import { ILinkedDataSignatureAttrs } from '../../linkedDataSignature/types'
import { ContextEntry } from 'cred-types-jolocom-core'

export interface IDidDocumentAttrs {
  '@context': ContextEntry[]
  id: string
  authentication: Array<string | IPublicKeySectionAttrs>
  publicKey: IPublicKeySectionAttrs[]
  service: IServiceEndpointSectionAttrs[]
  created: string
  proof: ILinkedDataSignatureAttrs
}
