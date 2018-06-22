import { SignedCredentialRequest } from './signedCredentialRequest'

export class SignedCredentialRequestParser {
  public static fromJSON = SignedCredentialRequest.fromJSON
  public static fromJWT = SignedCredentialRequest.fromJWT
}
