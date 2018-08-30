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
import { IPayload, IJSONWebTokenAttrs, IPayloadAttrs, InteractionType } from './types';
import { JolocomRegistry } from '../registries/jolocomRegistry';
import { registries } from '../registries';

export class JSONWebToken {
  private header: IJWTHeader = {
    typ: 'JWT',
    alg: 'ES256K'
  }
  private payload: IPayload
  private signature: string

  public getIssuer(): string {
    return this.payload.iss
  }

  public getIssueTime(): number {
    return this.payload.iat
  }

  public getPayload(): IPayload {
    return this.payload
  }

  public getSignature(): string {
    return this.signature
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

  public toJWT(): string {
    if (!this.payload || !this.header || !this.signature) {
      throw new Error('The JWT is not complete, header / payload / signature are missing')
    }

    return encodeAsJWT(this.header, this.payload, this.signature)
  }

  public toJSON(): object {
    return classToPlain(this)
  }

  public static fromJSON(json: IJSONWebTokenAttrs): JSONWebToken {
    let jwt = new JSONWebToken()

    switch (json.payload.typ) {
      case InteractionType.sso.toString(): {
        // TODO
        break
      }
      case InteractionType.credentials_receiving.toString(): {
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

  private computeSignature(privateKey: Buffer) {
    return computeJWTSignature(this.payload, privateKey)
  }
}
