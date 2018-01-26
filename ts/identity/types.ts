import Did from './did'
import AuthenticationCredential from './authenticationCredential'

export interface AuthenticationCredentialAttrs {
  id: Did
  'type': string[]
  owner: Did
  curve: string
  publicKeyBase64: string
}

export interface DidDocumentAttrs {
  '@context': string
  id: Did
  authenticationCredential: AuthenticationCredential
  created: Date
}
