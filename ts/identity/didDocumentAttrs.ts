import Did from './Did'
import AuthenticationCredential from './AuthenticationCredential'

export default interface DidDocumentAttrs {
  '@context': string
  id: Did
  authenticationCredential: AuthenticationCredential
  created: Date
}
