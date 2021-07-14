import {
  plainToClass,
  classToPlain,
  Type,
  Expose,
  Exclude,
} from 'class-transformer'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { ICredentialsReceiveAttrs } from './interactionTokens.types'

/**
 * @class
 * Class representing a credential response. encodable in JWT,
 * currently the same as a credential response without a validation
 * function. Will be extended with support for external verifications.
 */

@Exclude()
export class CredentialsReceive {
  private _signedCredentials: SignedCredential[]

  /**
   * Get all signed credentials encoded in the payload
   * @example `console.log(credentialReceive.suppliedCredentials) // [SignedCredential {...}, ...]`
   */

  @Expose()
  @Type(() => SignedCredential)
  get signedCredentials() {
    return this._signedCredentials
  }

  /**
   * Set an array of signed credentials to encoded in the response payload
   * @example `credentialReceive.suppliedCredentials = [SignedCredential {...}, ...]`
   */

  set signedCredentials(signedCredentials: SignedCredential[]) {
    this._signedCredentials = signedCredentials
  }

  /**
   * Serializes the {@link CredentialsReceive} as JSON-LD
   */

  public toJSON(): ICredentialsReceiveAttrs {
    return classToPlain(this) as ICredentialsReceiveAttrs
  }

  /**
   * Instantiates a {@link CredentialsReceive} from it's JSON form
   * @param json - JSON encoded credential receive interaction token
   */

  public static fromJSON(json: ICredentialsReceiveAttrs): CredentialsReceive {
    return plainToClass(CredentialsReceive, json)
  }
}
