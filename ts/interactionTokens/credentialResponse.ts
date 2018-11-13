import { plainToClass, classToPlain, Expose, Type, Exclude } from 'class-transformer'
import { ICredentialResponseAttrs } from './interactionTokens.types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { CredentialRequest } from './credentialRequest'

/**
 * @class
 * Class representing a credential response. encodable in jwt 
 */
@Exclude()
export class CredentialResponse {
  private _callbackURL: string
  private _suppliedCredentials: SignedCredential[]

  @Expose()
  @Type(() => SignedCredential)
  get suppliedCredentials(): SignedCredential[] {
    return this._suppliedCredentials
  }

  set suppliedCredentials(suppliedCredentials: SignedCredential[]) {
    this._suppliedCredentials = suppliedCredentials
  }

  @Expose()
  get callbackURL(): string {
    return this._callbackURL
  }

  set callbackURL(callbackURL: string) {
    this._callbackURL = callbackURL
  }

  /**
   * @description - Evaluates if the current response satisfies the requirements in a request
   * @param cr - Credential request to evaluate against
   * @return{boolean} - Whether the requirements in the request are satisfied
   */

  public satisfiesRequest(cr: CredentialRequest): boolean {
    const credentials = this.suppliedCredentials.map(sCredClass => sCredClass.toJSON())
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
