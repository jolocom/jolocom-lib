import { SignedCredentialResponse } from './signedCredentialResponse'

export class SignedCredentialResponseParser {
  public static fromJSON = SignedCredentialResponse.fromJSON
  public static fromJWT = SignedCredentialResponse.fromJWT
}
