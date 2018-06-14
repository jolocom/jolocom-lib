import { CredentialResponse } from '.'

export class CredentialResponseParser {
  public static fromJWT = CredentialResponse.fromJWT
  public static fromJSON = CredentialResponse.fromJSON
}
