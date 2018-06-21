import { IAuthenticationSectionAttrs, IPublicKeySectionAttrs } from './sections/types'

export interface IDidDocumentAttrs {
  '@context': string
  id: string
  authentication: IAuthenticationSectionAttrs[]
  publicKey: IPublicKeySectionAttrs[]
  created: Date
}
