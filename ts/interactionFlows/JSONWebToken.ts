import { IJWTHeader } from '../credentialRequest/signedCredentialRequest/types'
import { ILinkedDataSignature, ILinkedDataSignatureAttrs } from '../linkedDataSignature/types'
import {
  validateJWTSignature,
  computeJWTSignature,
  encodeAsJWT,
  validateJWTSignatureWithRegistry
} from '../utils/jwt'
import { decodeToken } from 'jsontokens'
import { classToPlain, plainToClass } from 'class-transformer'
import { IPayload, IJSONWebTokenAttrs, IPayloadAttrs, InteractionType, IJSONWebTokenCreationAttrs } from './types';
import { JolocomRegistry } from '../registries/jolocomRegistry';
import { registries } from '../registries';
import { privateKeyToDID } from '../utils/crypto';
import { SignedCredentialRequestPayload } from './signedCredentialRequest/signedCredentialRequestPayload';
import { ISignedCredRequestPayloadAttrs } from './signedCredentialRequest/types';

type InteractionTypeJWT = JSONWebToken<SignedCredentialRequestPayload>

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

  public static create(args: IJSONWebTokenCreationAttrs): InteractionTypeJWT {
    const { privateKey, payload } = args
    let issuer = payload.iss
    if (!issuer) {
      issuer = privateKeyToDID(privateKey)
    }
    payload.iat = Date.now()
    payload.iss = issuer

    let jwt
    switch (payload.typ) {
      case InteractionType.CredentialRequest: {
        jwt = new JSONWebToken<SignedCredentialRequestPayload>()
        jwt.payload = SignedCredentialRequestPayload.fromJSON(payload as ISignedCredRequestPayloadAttrs)
        console.log(payload)
        break
      }
      case InteractionType.CredentialResponse.toString(): {
        // TODO
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

    jwt.signature = jwt.sign(privateKey)

    return jwt
  }

  public sign(privateKey: Buffer) {
    return computeJWTSignature(this.payload, privateKey)
  }

  public validateSignatureWithPublicKey(pubKey: Buffer): boolean {
    return validateJWTSignature(this, pubKey)
  }

  public async validateSignature(registry?: JolocomRegistry): Promise<boolean> {
    if (!registry) {
      registry = registries.jolocom.create()
    }
    return validateJWTSignatureWithRegistry({ jwtInstance: this, registry })
  }

  public encode(): string {
    if (!this.payload || !this.header || !this.signature) {
      throw new Error('The JWT is not complete, header / payload / signature are missing')
    }

    return encodeAsJWT(this.header, this.payload, this.signature)
  }

  public toJSON(): object {
    return classToPlain(this)
  }

  public static fromJSON(json: IJSONWebTokenAttrs): InteractionTypeJWT {
    let jwt

    switch (json.payload.typ) {
      case InteractionType.CredentialRequest.toString(): {
        jwt = new JSONWebToken<SignedCredentialRequestPayload>()
        jwt.header = json.header
        jwt.payload = SignedCredentialRequestPayload.fromJSON(json.payload as ISignedCredRequestPayloadAttrs)
        jwt.signature = json.signature
        break
      }
      case InteractionType.CredentialResponse.toString(): {
        // TODO
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

  public static fromJWT(jwt: string): IPayload {
    const json = decodeToken(jwt)
    // should return just the payload class instance
    return JSONWebToken.fromJSON(json).payload
  }
}
