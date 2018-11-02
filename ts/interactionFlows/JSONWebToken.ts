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

type TransformArgs = {
  interactionToken: IJWTEncodable
  typ: InteractionType
  iat: Date
}

const convertPayload = <T extends JWTEncodable>({ iat, interactionToken, typ }: TransformArgs) => ({
  iat,
  interactionToken: payloadToJWT<T>(interactionToken, typ)
})

/* Generic class encoding and decodes various interaction tokens as and from JSON web tokens */

@Exclude()
export class JSONWebToken<T extends JWTEncodable> implements IDigestable {
  /* ES256K stands for ec signatures on secp256k1, de facto standard */
  @Expose()
  private header: IJWTHeader = {
    typ: 'JWT',
    alg: 'ES256K'
  }

  /*
   * When fromJSON is called, we parse the interaction token section, and instantiate
   * the appropriate interaction token class dynamically based on a key in the parsed json
  */

  @Expose()
  @Transform(value => convertPayload(value), { toClassOnly: true })
  private payload: IPayloadSection<T> = {
    iat: Date.now()
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

  /*
   * @description - Instantiates the class and stores the passed interaction token as a memger
   * @param toEncode - An instance of a class encodable as a JWT, e.g. credential request
   * @returns {Object} - A json web token instance
  */

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

  /*
   * @description - Decodes a base64 encoded JWT and instantiates this class based on content
   * @param jwt - base64 encoded JWT string
   * @returns {Object} - Instance of JSONWebToken class
  */

  public static decode<T extends JWTEncodable>(jwt: string): JSONWebToken<T> {
    return JSONWebToken.fromJSON(decodeToken(jwt))
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

  /*
   * @description - Instantiates a specific interaction class based on a key in the received JSON
   * @param payload - Interaction token in JSON form
   * @param typ - Interaction type
   * @returns {Object} - Instantiated class based on defined map
  */

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
