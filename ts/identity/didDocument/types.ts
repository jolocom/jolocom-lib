import { IPublicKeySectionAttrs, IAuthenticationSectionAttrs, IServiceEndpointSectionAttrs  } from './sections/types'
import { ILinkedDataSignatureAttrs } from '../../linkedDataSignature/types'

export interface IDidDocumentAttrs {
  '@context': string
  id: string
  authentication: IAuthenticationSectionAttrs[]
  publicKey: IPublicKeySectionAttrs[]
  service: IServiceEndpointSectionAttrs[]
  created: Date
  proof: ILinkedDataSignatureAttrs
}
