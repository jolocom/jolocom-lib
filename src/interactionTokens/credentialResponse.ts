import {
  plainToClass,
  classToPlain,
  Expose,
  Type,
  Exclude,
} from 'class-transformer'
import { ICredentialResponseAttrs } from './interactionTokens.types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { CredentialRequest } from './credentialRequest'

/**
 * @class
 * Class representing a credential response. encodable as a JWT
 */
@Exclude()
export class CredentialResponse {
  private _callbackURL: string
  private _suppliedCredentials: SignedCredential[]

  /**
   * Get all signed credentials encoded in the payload
   * @example `console.log(credentialResponse.suppliedCredentials) // [SignedCredential {...}, ...]`
   */

  @Expose()
  @Type(() => SignedCredential)
  get suppliedCredentials(): SignedCredential[] {
    return this._suppliedCredentials
  }

  /**
   * Set an array of signed credentials to be encoded in the response payload
   * @example `credentialResponse.suppliedCredentials = [SignedCredential {...}, ...]`
   */

  set suppliedCredentials(suppliedCredentials: SignedCredential[]) {
    this._suppliedCredentials = suppliedCredentials
  }

  /**
   * Get the callback url encoded in the payload
   * @example `console.log(credentialResponse.callbackURL) // 'http://example.com/offer/share'`
   */

  @Expose()
  get callbackURL(): string {
    return this._callbackURL
  }

  /**
   * Set the callback url encoded in the payload
   * @example `credentialResponse.callbackURL = 'http://example.com/offer/share'`
   */

  set callbackURL(callbackURL: string) {
    this._callbackURL = callbackURL
  }

  /**
   * Evaluates if the current response satisfies the requirements in a request
   * @param cr - {@link CredentialRequest} to evaluate against
   * @example `credentialResponse.satisfiesRequest(credentialRequest) // true`
   */

  public satisfiesRequest(cr: CredentialRequest): boolean {
    const credentials = this.suppliedCredentials.map(sCredClass =>
      sCredClass.toJSON(),
    )
    const validCredentials = cr.applyConstraints(credentials)
    return (
      !!this.suppliedCredentials.length &&
      this.suppliedCredentials.length === validCredentials.length
    )
  }

  /**
   * Serializes the {@link CredentialResponse} as JSON-LD
   */

  public toJSON(): ICredentialResponseAttrs {
    return classToPlain(this) as ICredentialResponseAttrs
  }

  /**
   * Instantiates a {@link CredentialResponse} from it's JSON form
   * @param json - JSON encoded credential response
   */

  public static fromJSON(json: ICredentialResponseAttrs): CredentialResponse {
    return plainToClass(this, json)
  }
}
