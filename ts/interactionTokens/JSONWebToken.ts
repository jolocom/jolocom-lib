import { IJWTHeader } from './types'
import base64url from 'base64url'
import { decodeToken } from 'jsontokens'
import { classToPlain, plainToClass, Expose, Transform } from 'class-transformer'
import { IJSONWebTokenAttrs, InteractionType } from './types'
import { sha256 } from '../utils/crypto'
import { IDigestable } from '../linkedDataSignature/types'
import { CredentialOffer } from './credentialOffer'
import { CredentialResponse } from './credentialResponse'
import { CredentialRequest } from './credentialRequest'
import { Authentication } from './authentication'
import { CredentialsReceive } from './credentialsReceive'

/* Local interfaces / types to save on typing later */

export type JWTEncodable = CredentialResponse | CredentialRequest | Authentication | CredentialOffer | CredentialsReceive

interface IJWTEncodable {
  [key: string]: any
}

interface IPayloadSection<T> {
  iat?: number
  exp?: number
  jti?: string
  iss?: string
  aud?: string
  typ?: InteractionType
  interactionToken?: T
}

interface TransformArgs {
  interactionToken: IJWTEncodable
  typ: InteractionType
  iat: Date
  exp: Date
  jti: string
  iss: string
  aud: string
}

const convertPayload = <T extends JWTEncodable>(args: TransformArgs) => ({
  ...args,
  interactionToken: payloadToJWT<T>(args.interactionToken, args.typ),
})

/* Generic class encoding and decodes various interaction tokens as and from JSON web tokens */

@Expose()
export class JSONWebToken<T extends JWTEncodable> implements IDigestable {
  /* ES256K stands for ec signatures on secp256k1, de facto standard */
  private header: IJWTHeader = {
    typ: 'JWT',
    alg: 'ES256K',
  }

  /*
   * When fromJSON is called, we parse the interaction token section, and instantiate
   * the appropriate interaction token class dynamically based on a key in the parsed json
  */

  @Transform(value => convertPayload(value), { toClassOnly: true })
  private payload: IPayloadSection<T> = {}
  
  /*
   * In case we are parsing a JWT with no signature, default to empty Buffer
   * In case sig is undefined on instance and we run toJSON, default to empty string
  */

  @Transform(value => value || '', { toPlainOnly: true })
  @Transform(value => value || Buffer.from(''), { toClassOnly: true })
  private signature: string

  public getIssuer(): string {
    return this.payload.iss
  }

  public getAudience(): string {
    return this.payload.aud
  }

  public getIssueTime(): number {
    return this.payload.iat
  }

  public getExpirationTime(): number {
    return this.payload.exp
  }

  public getTokenNonce(): string {
    return this.payload.jti
  }

  public getInteractionToken() {
    return this.payload.interactionToken
  }

  public getSignatureValue(): Buffer {
    return Buffer.from(this.signature, 'hex')
  }

  /*
   * @description - Instantiates the class and stores the passed interaction token as a member
   * @param toEncode - An instance of a class encodable as a JWT, e.g. credential request
   * @returns {Object} - A json web token instance
  */

  public static fromJWTEncodable<T extends JWTEncodable>(toEncode: T): JSONWebToken<T> {
    const jwt = new JSONWebToken<T>()
    jwt.setTokenContent(toEncode)
    return jwt
  }

  /*
   * @description - Populates the token issued and exiry times, expiry defaults to 1 hr
   * @returns {void}
  */

  public setIssueAndExpiryTime() {
    this.payload.iat = Date.now()
    this.payload.exp = this.payload.iat + 3600000
  }

  public setTokenNonce(nonce: string) {
    this.payload.jti = nonce
  }

  public setTokenIssuer(iss: string) {
    this.payload.iss = iss
  }

  public setTokenAudience(aud: string) {
    this.payload.aud = aud
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

  /*
   * @description - Decodes a base64 encoded JWT and instantiates this class based on content
   * @param jwt - base64 encoded JWT string
   * @returns {Object} - Instance of JSONWebToken class
  */

  public static decode<T extends JWTEncodable>(jwt: string): JSONWebToken<T> {
    const jwtClass = JSONWebToken.fromJSON(decodeToken(jwt))
    const validTimePeriod = jwtClass.getExpirationTime() - jwtClass.getIssueTime() > 1

    if (!validTimePeriod) {
      throw new Error('Token expired')
    }

    return jwtClass as JSONWebToken<T>
  }

  /*
   * @description - Encodes the class as a base64 JWT string
   * @returns {string} - base64 encoded JWT
  */

  public encode(): string {
    if (!this.payload || !this.header || !this.signature) {
      throw new Error('The JWT is not complete, header / payload / signature are missing')
    }

    return [
      base64url.encode(JSON.stringify(this.header)),
      base64url.encode(JSON.stringify(this.payload)),
      this.signature,
    ].join('.')
  }

  /*
   * @description - Serializes the class and computes the sha256 hash
   * @returns {Buffer} - sha256 hash of the serialized class
  */

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

/*
  * @description - Instantiates a specific interaction class based on a key in the received JSON
  * @param payload - Interaction token in JSON form
  * @param typ - Interaction type
  * @returns {Object} - Instantiated class based on defined map
*/

const payloadToJWT = <T extends JWTEncodable>(payload: IJWTEncodable, typ: InteractionType): T => {
  const payloadParserMap = {
    [InteractionType.CredentialOfferRequest]: CredentialOffer,
    [InteractionType.CredentialOfferResponse]: CredentialOffer,
    [InteractionType.CredentialRequest]: CredentialRequest,
    [InteractionType.CredentialResponse]: CredentialResponse,
    [InteractionType.CredentialsReceive]: CredentialsReceive,
  }

  const correspondingClass = payloadParserMap[typ]

  if (!correspondingClass) {
    throw new Error('Interaction type not recognized!')
  }

  return plainToClass<typeof correspondingClass, IJWTEncodable>(correspondingClass, payload)
}
