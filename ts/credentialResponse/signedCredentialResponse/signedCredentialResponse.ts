import 'reflect-metadata'
import { decodeToken } from 'jsontokens'
import { classToPlain, plainToClass } from 'class-transformer'
import { IJWTHeader } from '../../credentialRequest/signedCredentialRequest/types'
import { ISuppliedCredentialsAttrs } from '../types'
import { CredentialRequest } from '../../credentialRequest/credentialRequest'
import { ISignedCredResponsePayload, ISignedCredResponseCreationArgs, ISignedCredentialResponseAttrs } from './types'
import { CredentialResponse } from '../credentialResponse'
import { JolocomRegistry } from '../../registries/jolocomRegistry'
import {
  validateJWTSignature,
  computeJWTSignature,
  encodeAsJWT,
  validateJWTSignatureWithRegistry
} from '../../utils/jwt'
import { privateKeyToDID } from '../../utils/crypto'
import { registries } from '../../registries'

export class SignedCredentialResponse {
  private header: IJWTHeader = {
    typ: 'JWT',
    alg: 'ES256K'
  }

  private payload: ISignedCredResponsePayload

  private signature: string

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
    return computeJWTSignature(this.payload, privateKey)
  }

  public static create(args: ISignedCredResponseCreationArgs): SignedCredentialResponse {
    const { privateKey, credentialResponse } = args
    let { issuer } = args

    if (!issuer) {
      issuer = privateKeyToDID(privateKey)
    }

    const signedCr = new SignedCredentialResponse()
    signedCr.payload = {
      iss: issuer,
      iat: Date.now(),
      credentialResponse
    }

    signedCr.signature = signedCr.computeSignature(privateKey)
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
    signedCredentialResponse.payload.credentialResponse = CredentialResponse.fromJSON(json.payload.credentialResponse)
    return signedCredentialResponse
  }

  public static fromJWT(jwt: string): SignedCredentialResponse {
    const json = decodeToken(jwt)
    return SignedCredentialResponse.fromJSON(json)
  }
}
