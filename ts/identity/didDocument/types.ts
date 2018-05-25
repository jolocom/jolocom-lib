import { IAuthenticationSectionAttrs } from './sections/types'

export interface IDidDocumentAttrs {
  '@context': string
  id: string
  authenticationSection: IAuthenticationSectionAttrs
  created: Date
}
