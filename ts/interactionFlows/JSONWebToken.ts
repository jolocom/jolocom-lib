import { IJWTHeader } from './types'
import base64url from 'base64url'
import { decodeToken } from 'jsontokens'
import { classToPlain, plainToClass, Exclude, Expose, Transform } from 'class-transformer'
import { IJSONWebTokenAttrs, InteractionType } from './types'
import { sha256 } from '../utils/crypto'
import { IDigestable } from '../linkedDataSignature/types'
import { CredentialOffer } from './credentialOffer'
import { CredentialResponse } from './credentialResponse'
import { CredentialRequest } from './credentialRequest'
import { Authentication } from './authentication'
import { CredentialsReceive } from './credentialsReceive'

export type JWTEncodable = CredentialResponse | CredentialRequest | Authentication | CredentialOffer

export interface IJWTEncodable {
  [key: string]: any
}

interface IPayloadSection<T> {
  iat?: number
  iss?: string
  typ?: InteractionType
  interactionToken?: T
}

@Exclude()
export class JSONWebToken<T extends JWTEncodable> implements IDigestable {
  @Expose()
  private header: IJWTHeader = {
    typ: 'JWT',
    alg: 'ES256K'
  }

  @Expose()
  @Transform(
    (value: { interactionToken: IJWTEncodable, typ: InteractionType }) => ({
      ...value,
      interactionToken: payloadToJWT<T>(value.interactionToken, value.typ)
    }),
    { toClassOnly: true }
  )

  private payload: IPayloadSection<T> = { iat: Date.now()
  }

  @Expose()
  private signature: string

  public getIssuer(): string {
    return this.payload.iss
  }

  public getIssueTime(): number {
    return this.payload.iat
  }

  public getInteractionToken() {
    return this.payload.interactionToken
  }

  public static fromJWTEncodable<T extends JWTEncodable>(toEncode: T): JSONWebToken<T> {
    const jwt = new JSONWebToken<T>()
    jwt.setTokenContent(toEncode)
    return jwt
  }

  public getSignatureValue(): Buffer {
    return Buffer.from(this.signature, 'hex')
  }

  public setTokenIssuer(iss: string) {
    this.payload.iss = iss
  }

  public setTokenContent(payload: T) {
    this.payload.interactionToken = payload
  }

  public setTokenType(typ: InteractionType) {
    this.payload.typ = typ
  }

  public setSignature(signature: string) {
    this.signature = signature
  }

  public static decode<T extends JWTEncodable>(jwt: string): JSONWebToken<T> {
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

  public static fromJSON<T extends JWTEncodable>(json: IJSONWebTokenAttrs): JSONWebToken<T> {
    return plainToClass<JSONWebToken<T>, IJSONWebTokenAttrs>(JSONWebToken, json)
  }
}

const payloadToJWT = <T extends JWTEncodable>(payload: IJWTEncodable, typ: InteractionType): T => {
  const payloadParserMap = {
    // [InteractionType.Authentication]: Authentication,
    [InteractionType.CredentialOfferRequest]: CredentialOffer,
    [InteractionType.CredentialOfferResponse]: CredentialOffer,
    [InteractionType.CredentialRequest]: CredentialRequest,
    [InteractionType.CredentialResponse]: CredentialResponse,
    [InteractionType.CredentialsReceive]: CredentialsReceive

  }

  const correspondingClass = payloadParserMap[typ]

  if (!correspondingClass) {
    throw new Error('Interaction type not recognized!')
  }

  return plainToClass<typeof correspondingClass, IJWTEncodable>(correspondingClass, payload)
}
