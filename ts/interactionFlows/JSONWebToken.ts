import { IJWTHeader } from './types'
import base64url from 'base64url'
import { TokenSigner, TokenVerifier, decodeToken } from 'jsontokens'
import { classToPlain } from 'class-transformer'
import { IPayload, IJSONWebTokenAttrs, InteractionType, IJSONWebTokenCreationAttrs } from './types'
import { CredentialRequestPayload } from './credentialRequest/credentialRequestPayload'
import { CredentialResponsePayload } from './credentialResponse/credentialResponsePayload'
import { CredentialsReceivePayload } from './credentialsReceive/credentialsReceivePayload'
import { AuthenticationPayload } from './authentication/authenticationPayload'
import { IAuthPayloadCreationAttrs } from './authentication/types'
import { ICredentialResponsePayloadCreationAttrs } from './credentialResponse/types'
import { ICredentialRequestPayloadCreationAttrs } from './credentialRequest/types'
import { ICredentialsReceivePayloadCreationAttrs } from './credentialsReceive/types'
import { ICredentialOfferReqPayloadCreationAttrs } from './credentialOfferRequest/types'
import { createJolocomRegistry, JolocomRegistry } from '../registries/jolocomRegistry'
import { CredentialOfferRequestPayload } from './credentialOfferRequest/credentialOfferRequestPayload'
import { ICredentialOfferResPayloadCreationAttrs } from './credentialOfferResponse/types'
import { CredentialOfferResponsePayload } from './credentialOfferResponse/credentialOfferResponsePayload'

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

  public static async decode(jwt: string, registry?: JolocomRegistry): Promise<IPayload> {
    const json = decodeToken(jwt)
    let valid

    try {
      valid = await JSONWebToken.validateSignatureWithPublicKey({ keyId: json.payload.iss, jwt }, registry)
    } catch (error) {
      throw new Error(`Could not validate signature on decode. ${error.message}`)
    }

    if (!valid) {
      throw new Error('JWT signature is invalid')
    }

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

  public static async validateSignatureWithPublicKey({ keyId, jwt }: { keyId: string; jwt: string }, _registry?: JolocomRegistry): Promise<boolean> {
    const registry = _registry || createJolocomRegistry()
    const did = keyId.substring(0, keyId.indexOf('#'))
    let pubKey

    try {
      const identity = await registry.resolve(did)
      pubKey = identity.getPublicKeySection().find(pubKeySection => pubKeySection.getIdentifier() === keyId)
    } catch (error) {
      throw new Error(`Could not validate signature on JWT. ${error.message}`)
    }

    if (!pubKey) {
      throw new Error('No matching public key found.')
    }

    return new TokenVerifier('ES256K', pubKey.getPublicKeyHex()).verify(jwt)
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

  // TODO REMOVED TO STRING MIGHT BREAK
  private static payloadToJWT(payload: IPayload): JSONWebToken<IPayload> {
    let jwt

    switch (payload.typ) {
      case InteractionType.CredentialRequest: {
        jwt = new JSONWebToken<CredentialRequestPayload>()
        jwt.payload = CredentialRequestPayload.create(payload as ICredentialRequestPayloadCreationAttrs)
        break
      }
      case InteractionType.CredentialResponse: {
        jwt = new JSONWebToken<CredentialResponsePayload>()
        jwt.payload = CredentialResponsePayload.create(payload as ICredentialResponsePayloadCreationAttrs)
        break
      }
      case InteractionType.CredentialsReceive: {
        jwt = new JSONWebToken<CredentialsReceivePayload>()
        jwt.payload = CredentialsReceivePayload.create(payload as ICredentialsReceivePayloadCreationAttrs)
        break
      }
      case InteractionType.Authentication: {
        jwt = new JSONWebToken<AuthenticationPayload>()
        jwt.payload = AuthenticationPayload.create(payload as IAuthPayloadCreationAttrs)
        break
      }
      case InteractionType.CredentialOfferRequest: {
        jwt = new JSONWebToken<CredentialOfferRequestPayload>()
        jwt.payload = CredentialOfferRequestPayload.create(payload as ICredentialOfferReqPayloadCreationAttrs)
        break
      }
      case InteractionType.CredentialOfferResponse: {
        jwt = new JSONWebToken<CredentialOfferResponsePayload>()
        jwt.payload = CredentialOfferResponsePayload.create(payload as ICredentialOfferResPayloadCreationAttrs)
        break
      }
      default: {
        throw new Error('Interaction type not recognized!')
      }
    }
    return jwt
  }
}
