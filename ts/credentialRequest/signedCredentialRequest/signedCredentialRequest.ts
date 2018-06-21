import 'reflect-metadata'
import { decodeToken } from 'jsontokens'
import { classToPlain, plainToClass, Type } from 'class-transformer'
import { CredentialRequest } from '../credentialRequest'
import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types'
import { privateKeyToDID, encodeAsJWT, computeJWTSignature } from '../../utils/crypto'
import {
  IJWTHeader,
  ISignedCredentialRequestAttrs,
  ISignedCredRequestPayload,
  ISignedCredRequestCreationArgs
} from './types'

export class SignedCredentialRequest {
  private header: IJWTHeader = {
    alg: 'ES256K',
    typ: 'JWT'
  }

  private payload: ISignedCredRequestPayload

  private signature: string

  private computeSignature(privateKey: Buffer) {
    return computeJWTSignature(this.payload, privateKey)
  }

  public getCredentialRequest(): CredentialRequest {
    return this.payload.credentialRequest
  }

  public getIssueTime(): number {
    return this.payload.iat
  }

  public getCallbackURL(): string {
    return this.payload.credentialRequest.getCallbackURL()
  }

  public getRequestedCredentialTypes(): string[][] {
    return this.payload.credentialRequest.getRequestedCredentialTypes()
  }

  public getIssuer(): string {
    return this.payload.iss
  }

  public getSignature(): string {
    return this.signature
  }

  public static create(args: ISignedCredRequestCreationArgs): SignedCredentialRequest {
    const { privateKey, credentialRequest } = args
    let { issuer } = args

    if (!issuer) {
      issuer = privateKeyToDID(privateKey)
    }

    const signedCr = new SignedCredentialRequest()
    signedCr.payload = {
      iat: Date.now(),
      iss: issuer,
      credentialRequest
    }

    signedCr.signature = signedCr.computeSignature(privateKey)
    return signedCr
  }

  public validateSignature(): boolean {
    return false
  }

  public applyConstraints(credentials: ISignedCredentialAttrs[]): ISignedCredentialAttrs[] {
    return this.payload.credentialRequest.applyConstraints(credentials)
  }

  public toJWT(): string {
    if (!this.payload.credentialRequest || !this.header || !this.signature) {
      throw new Error('The JWT is not complete, header / payload / signature are missing')
    }

    return encodeAsJWT(this.header, this.payload, this.signature)
  }

  public static fromJWT(jwt: string): SignedCredentialRequest {
    const json = decodeToken(jwt)
    return SignedCredentialRequest.fromJSON(json)
  }

  public toJSON(): ISignedCredentialRequestAttrs {
    return classToPlain(this) as ISignedCredentialRequestAttrs
  }

  public static fromJSON(json: ISignedCredentialRequestAttrs): SignedCredentialRequest {
    const signedCredentialReq = plainToClass(SignedCredentialRequest, json)
    signedCredentialReq.payload.credentialRequest = CredentialRequest.fromJSON(json.payload.credentialRequest)
    return signedCredentialReq
  }
}
