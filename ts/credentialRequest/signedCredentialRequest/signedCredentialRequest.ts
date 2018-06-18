import { CredentialRequest } from '..'
import { IJWTHeader, ISignedCredentialRequestAttrs } from './types'
import { decodeToken } from 'jsontokens'
import { classToPlain, plainToClass } from 'class-transformer'
import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types'

export class SignedCredentialRequest {
  private header: IJWTHeader
  private payload: CredentialRequest
  private signature: string

  // CREATE method?

  public getCallbackURL(): string {
    return this.payload.getCallbackURL()
  }

  public getRequester(): string {
    return this.payload.getRequester()
  }

  public getRequestedCredentialTypes(): string[][] {
    return this.payload.getRequestedCredentialTypes()
  }

  public validateSignature(): boolean {
    return false
  }

  public applyConstraints(credentials: ISignedCredentialAttrs[]): ISignedCredentialAttrs[] {
    return this.payload.applyConstraints(credentials)
  }

  // TODO implement
  public toJWT(): string {
    return 'TODO'
  }

  public static fromJWT(jwt: string): SignedCredentialRequest {
    const json = decodeToken(jwt)
    return SignedCredentialRequest.fromJSON(json)
  }

  public toJSON(): ISignedCredentialRequestAttrs {
    return classToPlain(this) as ISignedCredentialRequestAttrs
  }

  public static fromJSON(json: ISignedCredentialRequestAttrs): SignedCredentialRequest {
    return plainToClass(SignedCredentialRequest, json)
  }
}
