import { SignedCredentialRequest } from './signedCredentialRequest'

export const SignedCredentialRequestParser = {
  fromJSON : SignedCredentialRequest.fromJSON,
  fromJWT : SignedCredentialRequest.fromJWT
}
