import base64url from 'base64url'
import { decodeToken } from 'jsontokens'
import { classToPlain, plainToClass, Expose, Transform, Exclude } from 'class-transformer'
import { IJWTHeader } from './types'
import { IJSONWebTokenAttrs, InteractionType } from './types'
import { sha256 } from '../utils/crypto'
import { IDigestable } from '../linkedDataSignature/types'
import { CredentialOffer } from './credentialOffer'
import { CredentialResponse } from './credentialResponse'
import { CredentialRequest } from './credentialRequest'
import { Authentication } from './authentication'
import { CredentialsReceive } from './credentialsReceive'
import { handleValidationStatus, keyIdToDid } from '../utils/helper'
import {PaymentResponse} from './paymentResponse'
import {PaymentRequest} from './paymentRequest'

/* Local interfaces / types to save on typing later */

export type JWTEncodable =
  | CredentialResponse
  | CredentialRequest
  | Authentication
  | CredentialOffer
  | CredentialsReceive
  | PaymentRequest
  | PaymentResponse

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
  interactionToken: payloadToJWT<T>(args.interactionToken, args.typ)
})

/* Generic class encoding and decodes various interaction tokens as and from JSON web tokens */

@Exclude()
export class JSONWebToken<T extends JWTEncodable> implements IDigestable {
  /* ES256K stands for ec signatures on secp256k1, de facto standard */
  private _header: IJWTHeader = {
    typ: 'JWT',
    alg: 'ES256K'
  }
  private _signature: string
  private _payload: IPayloadSection<T> = {}

  /*
   * When fromJSON is called, we parse the interaction token section, and instantiate
   * the appropriate interaction token class dynamically based on a key in the parsed json
   */

  @Expose()
  @Transform(value => convertPayload(value), { toClassOnly: true })
  get payload() {
    return this._payload
  }

  set payload(payload: IPayloadSection<T>) {
    this._payload = payload
  }

  @Expose()
  @Transform(value => value || '')
  get signature() {
    return this._signature
  }

  set signature(signature) {
    this._signature = signature
  }

  get issuer() {
    return this.payload.iss
  }

  set issuer(issuer) {
    this.payload.iss = issuer
  }

  get audience() {
    return this.payload.aud
  }

  set audience(audience: string) {
    this.payload.aud = audience
  }

  get issued() {
    return this.payload.iat
  }

  get expires() {
    return this.payload.exp
  }

  get nonce() {
    return this.payload.jti
  }

  set nonce(nonce) {
    this.payload.jti = nonce
  }

  get interactionToken() {
    return this.payload.interactionToken
  }

  set interactionToken(interactionToken) {
    this.payload.interactionToken = interactionToken
  }

  get interactionType() {
    return this.payload.typ
  }

  set interactionType(type) {
    this.payload.typ = type
  }

  @Expose()
  get header() {
    return this._header
  }

  set header(jwtHeader: IJWTHeader) {
    this._header = jwtHeader
  }

  get signer() {
    return {
      did: keyIdToDid(this.issuer),
      keyId: this.issuer
    }
  }

  /*
   * @description - Instantiates the class and stores the passed interaction token as a member
   * @param toEncode - An instance of a class encodable as a JWT, e.g. credential request
   * @returns {Object} - A json web token instance
   */

  public static fromJWTEncodable<T extends JWTEncodable>(toEncode: T): JSONWebToken<T> {
    const jwt = new JSONWebToken<T>()
    jwt.interactionToken = toEncode
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

  /*
   * @description - Decodes a base64 encoded JWT and instantiates this class based on content
   * @param jwt - base64 encoded JWT string
   * @returns {Object} - Instance of JSONWebToken class
   */

  public static decode<T extends JWTEncodable>(jwt: string): JSONWebToken<T> {
    const interactionToken = JSONWebToken.fromJSON(decodeToken(jwt))
    handleValidationStatus((interactionToken.expires > Date.now()), 'exp')

    return interactionToken as JSONWebToken<T>
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
      this.signature
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

/**
 * @description - Instantiates a specific interaction class based on a key in the received JSON
 * @param payload - Interaction token in JSON form
 * @param typ - Interaction type
 * @returns {Object} - Instantiated class based on defined map
 */
/** @TODO use class transformer's discriminator */
const payloadToJWT = <T extends JWTEncodable>(payload: IJWTEncodable, typ: InteractionType): T => {
  const payloadParserMap = {
    [InteractionType.CredentialsReceive]: CredentialsReceive,
    [InteractionType.CredentialOffer]: CredentialOffer,
    [InteractionType.CredentialRequest]: CredentialRequest,
    [InteractionType.CredentialResponse]: CredentialResponse,
    [InteractionType.PaymentRequest]: PaymentRequest,
    [InteractionType.PaymentResponse]: PaymentResponse,
    // [InteractionType.Authentication]: Authentication
  }

  const correspondingClass = payloadParserMap[typ]

  if (!correspondingClass) {
    throw new Error('Interaction type not recognized!')
  }

  return plainToClass<typeof correspondingClass, IJWTEncodable>(correspondingClass, payload)
}
