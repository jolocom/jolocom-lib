import 'reflect-metadata'
import base64url from 'base64url'
import { TokenSigner, decodeToken } from 'jsontokens'
import { classToPlain, plainToClass, Type } from 'class-transformer'
import { CredentialRequest } from '../credentialRequest'
import { ISignedCredentialAttrs } from '../../credentials/signedCredential/types'
import { privateKeyToDID } from '../../utils/crypto'
import {
  IJWTHeader,
  ISignedCredentialRequestAttrs,
  ISignedCredRequestPayload,
  ISignedCredRequestCreationArgs
} from './types'

export class SignedCredentialRequest {
  private header: IJWTHeader =  {
    alg: 'ES256K',
    typ: 'JWT'
  }

  private payload: ISignedCredRequestPayload = {
    iat: null,
    iss: null,
    credentialRequest: null
  }

  private signature: string

  private setIssueTime(timestamp: number) {
    this.payload.iat = timestamp
  }

  private setCredentialRequest(credentialRequest: CredentialRequest) {
    this.payload.credentialRequest = credentialRequest
  }

  private setSignature(signature: string) {
    this.signature = signature
  }

  private setIssuer(issuer: string) {
    this.payload.iss = issuer
  }

  private computeSignature(privateKey: Buffer) {
    this.setIssueTime(Date.now())

    const payload = {
      iat: this.getIssueTime(),
      credentialRequest: this.getCredentialRequest().toJSON()
    }

    const signed = new TokenSigner('ES256K', privateKey.toString('hex')).sign(payload)
    return decodeToken(signed).signature
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

  public static create(args: ISignedCredRequestCreationArgs): SignedCredentialRequest {
    const { privateKey, credentialRequest } = args
    let { issuer } = args

    if (!issuer) {
      issuer = privateKeyToDID(privateKey)
    }

    const signedCr = new SignedCredentialRequest()
    signedCr.setIssuer(issuer)
    signedCr.setCredentialRequest(credentialRequest)
    signedCr.setSignature(signedCr.computeSignature(privateKey))
    return signedCr
  }

  public validateSignature(): boolean {
    return false
  }

  public applyConstraints(credentials: ISignedCredentialAttrs[]): ISignedCredentialAttrs[] {
    return this.payload.credentialRequest.applyConstraints(credentials)
  }

  public toJWT(): string {
    if (!this.payload.credentialRequest || !this.header || this.signature) {
      throw new Error('The JWT is not complete, header / payload / signature are missing')
    }

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
