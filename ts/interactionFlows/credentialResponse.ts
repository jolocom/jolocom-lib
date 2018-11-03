import { plainToClass, classToPlain, Expose, Type } from 'class-transformer'
import { ICredentialResponseAttrs } from './credentialResponse/types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { CredentialRequest } from './credentialRequest'

/* Class representing a credential response. encodable in jwt */
@Expose()
export class CredentialResponse {
  private callbackURL: string

  /* Automatically instantiate SignedCredential class on fromJSON, and serialize on fromJSON */
  @Type(() => SignedCredential)
  private suppliedCredentials: SignedCredential[]

  public getSuppliedCredentials(): SignedCredential[] {
    return this.suppliedCredentials
  }

  public getCallbackURL(): string {
    return this.callbackURL
  }

  /*
   * @description - Evaluates if the current response satisfies the requirements in a request
   * @param cr - Credential request to evaluate against
   * @return{boolean} - Whether the requirements in the request are satisfied
   */

  public satisfiesRequest(cr: CredentialRequest): boolean {
    const credentials = this.suppliedCredentials.map((sCredClass) => sCredClass.toJSON())
    const validCredentials = cr.applyConstraints(credentials)
    return this.suppliedCredentials.length === validCredentials.length
  }

  public toJSON(): ICredentialResponseAttrs {
    return classToPlain(this) as ICredentialResponseAttrs
  }

  public static fromJSON(json: ICredentialResponseAttrs): CredentialResponse {
    return plainToClass(this, json)
  }
}
