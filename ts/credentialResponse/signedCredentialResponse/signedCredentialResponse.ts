import 'reflect-metadata'
import { TokenSigner, decodeToken } from 'jsontokens'
import { classToPlain, plainToClass } from 'class-transformer'
import { IJWTHeader } from '../../credentialRequest/signedCredentialRequest/types'
import { ISuppliedCredentialsAttrs } from '../types'
import { CredentialRequest } from '../../credentialRequest/credentialRequest'
import { ISignedCredResponsePayload, ISignedCredResponseCreationArgs, ISignedCredentialResponseAttrs } from './types'
import { privateKeyToDID, encodeAsJWT } from '../../utils/crypto'
import { CredentialResponse } from '../credentialResponse'

export class SignedCredentialResponse {
  private header: IJWTHeader = {
    alg: 'ES256K',
    typ: 'JWT'
  }

  private payload: ISignedCredResponsePayload = {
    iss: null,
    iat: null,
    credentialResponse: null
  }

  private signature: string

  private setIssueTime(timestamp: number) {
    this.payload.iat = timestamp
  }

  private setCredentialResponse(credentialResponse: CredentialResponse) {
    this.payload.credentialResponse = credentialResponse
  }

  private setSignature(signature: string) {
    this.signature = signature
  }

  private setIssuer(issuer: string) {
    this.payload.iss = issuer
  }

  public getIssueTime(): number {
    return this.payload.iat
  }

  public getCredentialResponse(): CredentialResponse {
    return this.payload.credentialResponse
  }

  public getSignature(): string {
    return this.signature
  }

  private computeSignature(privateKey: Buffer) {
    this.setIssueTime(Date.now())

    const payload = {
      iat: this.getIssueTime(),
      credentialRequest: this.getCredentialResponse().toJSON()
    }

    const signed = new TokenSigner('ES256K', privateKey.toString('hex')).sign(payload)
    return decodeToken(signed).signature
  }

  public static create(args: ISignedCredResponseCreationArgs): SignedCredentialResponse {
    const { privateKey, credentialResponse } = args
    let { issuer } = args

    if (!issuer) {
      issuer = privateKeyToDID(privateKey)
    }

    const signedCr = new SignedCredentialResponse()
    signedCr.setIssuer(issuer)
    signedCr.setCredentialResponse(credentialResponse)
    signedCr.setSignature(signedCr.computeSignature(privateKey))
    return signedCr
  }

  public getIssuer(): string {
    return this.payload.iss
  }

  public getSuppliedCredentials(): ISuppliedCredentialsAttrs[] {
    return this.payload.credentialResponse.getSuppliedCredentials()
  }

  public satisfiesRequest(cr: CredentialRequest): boolean {
    return this.payload.credentialResponse.satisfiesRequest(cr)
  }

  public toJWT(): string {
    if (!this.payload.credentialResponse || !this.header || !this.signature) {
      throw new Error('The JWT is not complete, header / payload / signature are missing')
    }

    return encodeAsJWT(this.header, this.payload, this.signature)
  }

  public toJSON(): ISignedCredentialResponseAttrs {
    return classToPlain(this) as ISignedCredentialResponseAttrs
  }

  public static fromJSON(json: ISignedCredentialResponseAttrs): SignedCredentialResponse {
    const signedCredentialResponse = plainToClass(SignedCredentialResponse, json)
    signedCredentialResponse.setCredentialResponse(CredentialResponse.fromJSON(json.payload.credentialResponse))
    return signedCredentialResponse
  }

  public static fromJWT(jwt: string): SignedCredentialResponse {
    const json = decodeToken(jwt)
    return SignedCredentialResponse.fromJSON(json)
  }
}
