import 'reflect-metadata'
import { CredentialRequest } from '../credentialRequest'
import base64url from 'base64url'
import { IJWTHeader, ISignedCredentialRequestAttrs } from './types'
import { decodeToken } from 'jsontokens'
import { classToPlain, plainToClass, Type } from 'class-transformer'
import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types'

export class SignedCredentialRequest {
  private header: IJWTHeader

  @Type(() => CredentialRequest)
  private payload: CredentialRequest
  private signature: string

  public getCallbackURL(): string {
    return this.payload.getCallbackURL()
  }
  public static create(json: ISignedCredentialRequestAttrs): SignedCredentialRequest {
    return SignedCredentialRequest.fromJSON(json)
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

  public toJWT(): string {
    const jwtParts = []

    jwtParts.push(base64url.encode(JSON.stringify(this.header)))
    jwtParts.push(base64url.encode(JSON.stringify(this.payload)))
    jwtParts.push(this.signature)

    return jwtParts.join('.')
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
