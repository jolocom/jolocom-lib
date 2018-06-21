import { plainToClass, classToPlain } from 'class-transformer'
import { TokenSigner, decodeToken } from 'jsontokens'
import { CredentialRequest } from '../credentialRequest'
import { ISuppliedCredentialsAttrs, ICredentialResponseAttrs } from './types'
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types';

export class CredentialResponse {
  private issuer: string
  private suppliedCredentials: ISuppliedCredentialsAttrs[] = []

  public setIssuer(did: string) {
    this.issuer = did
  }

  public getIssuer(): string {
    return this.issuer
  }

  public getSuppliedCredentials(): ISuppliedCredentialsAttrs[] {
    return this.suppliedCredentials
  }

  // TODO two credentials of the same type
  public addSuppliedCredentials(credentials: ISignedCredentialAttrs[]) {
    credentials.forEach((credential) => {
      this.suppliedCredentials.push({
        type: credential.type,
        credential
      })
    })
  }

  // TODO static as per #84
  public create(credentials: ISignedCredentialAttrs[]): CredentialResponse {
    const CR = new CredentialResponse()
    CR.addSuppliedCredentials(credentials)
    return CR
  }

  public satisfiesRequest(cr: CredentialRequest): boolean {
    const credentials = this.suppliedCredentials.map((section) => section.credential)
    const validCredentials = cr.applyConstraints(credentials)
    return credentials.length === validCredentials.length
  }

  // TODO Abstract for reuse
  public toJWT(privKey: Buffer): string {
    const hexKey = privKey.toString('hex')

    const token = {
      iat: Date.now(),
      ...this.toJSON()
    }
    return new TokenSigner('ES256K', hexKey).sign(token)
  }
  public toJSON(): ICredentialResponseAttrs {
    return classToPlain(this) as ICredentialResponseAttrs
  }

  public static fromJSON(json: ICredentialResponseAttrs): CredentialResponse {
    return plainToClass(CredentialResponse, json)
  }

  // TODO Abstract for reuse
  public static fromJWT(jwt: string): CredentialResponse {
    const { payload } = decodeToken(jwt)
    return CredentialResponse.fromJSON(payload)
  }
}
