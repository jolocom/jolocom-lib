import Did from './did'
import AuthenticationCredential from './authenticationCredential'

export default interface DidDocumentAttrs {
  '@context': string
  id: Did
  authenticationCredential: AuthenticationCredential
  created: Date
}
