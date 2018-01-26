import Did from './did'
import AuthenticationCredential from './authenticationCredential'

export interface AuthenticationCredentialAttrs {
  id: string
  'type': string[]
  owner: string
  curve: string
  publicKeyBase64: string
}

export interface DidDocumentAttrs {
  '@context': string
  id: Did
  authenticationCredential: AuthenticationCredential
  created: Date
}
