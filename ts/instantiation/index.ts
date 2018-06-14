import { CredentialRequest } from '../credentialRequest'
import { CredentialResponse } from '../credentialResponse'
import { Credential } from '../credentials/credential'
import { VerifiableCredential } from '../credentials/verifiableCredential'

export const instanate = {
  credentialRequest: {
    fromJSON: CredentialRequest.fromJSON
  },
  credentialResponse: {
    fromJSON: CredentialResponse.fromJSON
  },
  credential: {
    fromJSON: Credential.fromJSON
  },
  signedCredentialRequest: {
    fromJSON: () => CredentialRequest.fromJSON,
    fromJWT: () => CredentialResponse.fromJWT
  },
  signedCredentialResponse: {
    fromJSON: () => CredentialResponse.fromJSON,
    fromJWT: () => CredentialResponse.fromJWT
  },
  signedCredential: {
    fromJSON: () => VerifiableCredential.fromJSON
  }
}
