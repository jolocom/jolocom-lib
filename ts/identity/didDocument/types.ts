import { IAuthenticationSection } from './sections/types'

export interface IDidDocument {
  '@context': string
  id: string
  authenticationSection: IAuthenticationSection
  created: Date
}
