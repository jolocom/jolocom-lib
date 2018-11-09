import { plainToClass, classToPlain, Type, Expose, Exclude } from 'class-transformer'
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

  @Expose()
  @Type(() => SignedCredential)
  get signedCredentials() {
    return this._signedCredentials
  }

  set signedCredentials(signedCredentials: SignedCredential[]) {
    this._signedCredentials = signedCredentials
  }

  public toJSON(): ICredentialsReceiveAttrs {
    return classToPlain(this) as ICredentialsReceiveAttrs
  }

  public static fromJSON(json: ICredentialsReceiveAttrs): CredentialsReceive {
    return plainToClass(CredentialsReceive, json)
  }
}
