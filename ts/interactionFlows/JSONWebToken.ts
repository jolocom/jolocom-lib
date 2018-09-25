import { IJWTHeader } from './types'
import base64url from 'base64url'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'
import { classToPlain } from 'class-transformer'
import {
  IPayload,
  IJSONWebTokenAttrs,
  InteractionType,
  IJSONWebTokenCreationAttrs,
} from './types';
import { CredentialRequestPayload } from './credentialRequest/credentialRequestPayload';
import { CredentialResponsePayload } from './credentialResponse/credentialResponsePayload';
import { ICredentialResponsePayloadCreationAttrs } from './credentialResponse/types';
import { ICredentialRequestPayloadCreationAttrs } from './credentialRequest/types';

export class JSONWebToken<T extends IPayload> {
  private header: IJWTHeader = {
    typ: 'JWT',
    alg: 'ES256K'
  }
  private payload: T
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

  public getSignature(): string {
    return this.signature
  }

  public static create(args: IJSONWebTokenCreationAttrs): JSONWebToken<IPayload> {
    const { privateKey, payload } = args

    const jwt = JSONWebToken.payloadToJWT(payload)

    jwt.payload.iat = Date.now()
    jwt.payload.iss = privateKey.id
    jwt.signature = jwt.sign(privateKey.key)

    return jwt
  }

  public static decode(jwt: string): IPayload {
    const json = decodeToken(jwt)
    // TODO: verify the signature
    // should return just the payload class instance
    return JSONWebToken.fromJSON(json).payload
  }

  public encode(): string {
    if (!this.payload || !this.header || !this.signature) {
      throw new Error('The JWT is not complete, header / payload / signature are missing')
    }
    const jwtParts = []
    jwtParts.push(base64url.encode(JSON.stringify(this.header)))
    jwtParts.push(base64url.encode(JSON.stringify(this.payload)))
    jwtParts.push(this.signature)
    return jwtParts.join('.')
  }

  public sign(privateKey: Buffer) {
    const signed = new TokenSigner('ES256K', privateKey.toString('hex')).sign(this.payload)
    return decodeToken(signed).signature
  }

  public validateSignatureWithPublicKey(pubKey: Buffer): boolean {
    if (!pubKey) {
      throw new Error('Please provide the issuer\'s public key')
    }
    // TODO Normalize / have a cannonical json form
    const assembledJWT = this.encode()
    return new TokenVerifier('ES256K', pubKey.toString('hex')).verify(assembledJWT)
  }

  public toJSON(): IJSONWebTokenAttrs {
    return classToPlain(this) as IJSONWebTokenAttrs
  }

  public static fromJSON(json: IJSONWebTokenAttrs): JSONWebToken<IPayload> {
    const jwt = JSONWebToken.payloadToJWT(json.payload)
    jwt.header = json.header
    jwt.signature = json.signature

    return jwt
  }

  private static payloadToJWT(payload: IPayload): JSONWebToken<IPayload> {
    let jwt

    switch (payload.typ) {
      case InteractionType.CredentialRequest.toString(): {
        jwt = new JSONWebToken<CredentialRequestPayload>()
        console.log(payload.credentialRequest.credentialRequirements, 'payload in JWT')
        jwt.payload = CredentialRequestPayload.create(payload as ICredentialRequestPayloadCreationAttrs)
        break
      }
      case InteractionType.CredentialResponse.toString(): {
        jwt = new JSONWebToken<CredentialResponsePayload>()
        jwt.payload = CredentialResponsePayload.create(payload as ICredentialResponsePayloadCreationAttrs)
        break
      }
      case InteractionType.CredentialsReceiving.toString(): {
        // TODO
        break
      }
      default: {
        throw new Error('Interaction type not recognized!')
        break
      }
    }
    return jwt
  }
}
