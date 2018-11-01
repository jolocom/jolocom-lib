import { IJWTHeader, IPayloadCreationAttrs } from './types'
import base64url from 'base64url'
import { decodeToken } from 'jsontokens'
import { classToPlain, plainToClass, Exclude, Expose, Transform } from 'class-transformer'
import { IPayload, IJSONWebTokenAttrs, InteractionType } from './types'
import { CredentialRequestPayload } from './credentialRequest/credentialRequestPayload'
import { CredentialResponsePayload } from './credentialResponse/credentialResponsePayload'
import { CredentialsReceivePayload } from './credentialsReceive/credentialsReceivePayload'
import { AuthenticationPayload } from './authentication/authenticationPayload'
import { CredentialOfferRequestPayload } from './credentialOfferRequest/credentialOfferRequestPayload'
import { CredentialOfferResponsePayload } from './credentialOfferResponse/credentialOfferResponsePayload'
import { sha256 } from '../utils/crypto'
import { IDigestable } from '../linkedDataSignature/types'
@Exclude()
export class JSONWebToken<T extends IPayload> implements IDigestable {
  @Expose()
  private header: IJWTHeader = {
    typ: 'JWT',
    alg: 'ES256K'
  }

  @Expose()
  @Transform((value: IPayload) => payloadToJWT(value))
  private payload: T

  @Expose()
  private signature: string

  public getIssuer(): string {
    return this.payload.iss
  }

  public getIssueTime(): number {
    return this.payload.iat
  }

  public getPayload(): T {
    return this.payload
  }

  public getSignatureValue(): Buffer {
    return Buffer.from(this.signature, 'hex')
  }

  public setPayload(payload: T) {
    this.payload = payload
  }

  public setSignature(signature: string) {
    this.signature = signature
  }

  public static create(payload: IPayloadCreationAttrs, iss: string): JSONWebToken<IPayload> {
    const jwt = new JSONWebToken()
    jwt.setPayload(payloadToJWT(payload))
    jwt.payload.iat = Date.now()
    return jwt
  }

  public static decode(jwt: string): JSONWebToken<IPayload> {
    return JSONWebToken.fromJSON(decodeToken(jwt))
  }

  public encode(): string {
    if (!this.payload || !this.header || !this.signature) {
      throw new Error('The JWT is not complete, header / payload / signature are missing')
    }

    return [
      base64url.encode(JSON.stringify(this.header)),
      base64url.encode(JSON.stringify(this.payload)),
      this.signature
    ].join('.')
  }

  public async digest() {
    const { encode } = base64url
    const toSign = [encode(JSON.stringify(this.header)), encode(JSON.stringify(this.payload))].join('.')
    return sha256(Buffer.from(toSign))
  }

  public toJSON(): IJSONWebTokenAttrs {
    return classToPlain(this) as IJSONWebTokenAttrs
  }

  public static fromJSON(json: IJSONWebTokenAttrs): JSONWebToken<IPayload> {
    return plainToClass(this, json)
  }
}

const payloadToJWT = (payload: IPayload): IPayload => {
  const payloadParserMap = {
    [InteractionType.Authentication]: AuthenticationPayload,
    [InteractionType.CredentialOfferRequest]: CredentialOfferRequestPayload,
    [InteractionType.CredentialOfferResponse]: CredentialOfferResponsePayload,
    [InteractionType.CredentialRequest]: CredentialRequestPayload,
    [InteractionType.CredentialResponse]: CredentialResponsePayload,
    [InteractionType.CredentialsReceive]: CredentialsReceivePayload
  }

  const correspondingClass = payloadParserMap[payload.typ]

  if (!correspondingClass) {
    throw new Error('Interaction type not recognized!')
  }

  return plainToClass(correspondingClass, payload) as typeof correspondingClass
}
