import { plainToClass, classToPlain, Type, Expose } from 'class-transformer'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { ICredentialsReceiveAttrs } from './credentialsReceive/types'

/*
 * Class representing a credential response. encodable in JWT,
 * currently the same as a credential response without a validation
 * function. Will be extended with support for external verifications.
*/
@Expose()
export class CredentialsReceive {
  /* Automatically instantiate SignedCredential class on fromJSON, and serialize on fromJSON */
  @Type(() => SignedCredential)
  private signedCredentials: SignedCredential[]

  public getSignedCredentials(): SignedCredential[] {
    return this.signedCredentials
  }

  public toJSON(): ICredentialsReceiveAttrs {
    return classToPlain(this) as ICredentialsReceiveAttrs
  }

  public static fromJSON(json: ICredentialsReceiveAttrs): CredentialsReceive {
    return plainToClass(CredentialsReceive, json)
  }
}
