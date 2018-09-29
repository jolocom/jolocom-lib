import { plainToClass, classToPlain } from 'class-transformer'
import { ICredentialResponseAttrs } from './types'
import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types'
import { CredentialRequest } from '../credentialRequest/credentialRequest'
import { SignedCredential } from '../../credentials/signedCredential/signedCredential'

export class CredentialResponse {
  public suppliedCredentials: SignedCredential[]

  public static create(credentials: ISignedCredentialAttrs[]): CredentialResponse {
    const credentialResponse = new CredentialResponse()
    credentialResponse.suppliedCredentials = credentials
      .map((sCred) => plainToClass(SignedCredential, sCred))
    
    return credentialResponse
  }

  public getSuppliedCredentials(): SignedCredential[] {
    return this.suppliedCredentials
  }

  // TODO: expose this method also on respective payload
  public satisfiesRequest(cr: CredentialRequest): boolean {
    const credentials = this.suppliedCredentials
      .map((sCredClass) => sCredClass.toJSON())
    
    const validCredentials = cr.applyConstraints(credentials)
    
    return this.suppliedCredentials.length === validCredentials.length
  }

  public toJSON(): ICredentialResponseAttrs {
    return classToPlain(this) as ICredentialResponseAttrs
  }

  public static fromJSON(json: ICredentialResponseAttrs): CredentialResponse {
    const credResponse = plainToClass(CredentialResponse, json)
    credResponse.suppliedCredentials = json.suppliedCredentials
      .map((sCred) => plainToClass(SignedCredential, sCred))
    
    return credResponse
  }
}
