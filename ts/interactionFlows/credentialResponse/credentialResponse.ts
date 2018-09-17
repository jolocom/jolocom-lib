import { plainToClass, classToPlain } from 'class-transformer'
import { ISuppliedCredentialsAttrs, ICredentialResponseAttrs } from './types'
import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types';
import { CredentialRequest } from '../credentialRequest/credentialRequest';

export class CredentialResponse {
  private suppliedCredentials: ISuppliedCredentialsAttrs[] = []

  public static create(credentials: ISignedCredentialAttrs[]): CredentialResponse {
    const CR = new CredentialResponse()
    CR.addSuppliedCredentials(credentials)
    return CR
  }

  private addSuppliedCredentials(credentials: ISignedCredentialAttrs[]) {
    credentials.forEach((credential) => {
      this.suppliedCredentials.push({
        type: credential.type,
        credential
      })
    })
  }

  public getSuppliedCredentials(): ISuppliedCredentialsAttrs[] {
    return this.suppliedCredentials
  }

  public satisfiesRequest(cr: CredentialRequest): boolean {
    const credentials = this.suppliedCredentials.map((section) => section.credential)
    const validCredentials = cr.applyConstraints(credentials)
    return credentials.length === validCredentials.length
  }

  public toJSON(): ICredentialResponseAttrs {
    return classToPlain(this) as ICredentialResponseAttrs
  }

  public static fromJSON(json: ICredentialResponseAttrs): CredentialResponse {
    return plainToClass(CredentialResponse, json)
  }
}
