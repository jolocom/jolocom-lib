import 'reflect-metadata'
import { decodeToken, TokenVerifier } from 'jsontokens'
import { classToPlain, plainToClass } from 'class-transformer'
import { CredentialRequest } from '../credentialRequest'
import { privateKeyToDID, encodeAsJWT, computeJWTSignature, verifySignature } from '../../utils/crypto'
import {
  IJWTHeader,
  ISignedCredentialRequestAttrs,
  ISignedCredRequestPayload,
  ISignedCredRequestCreationArgs
} from './types'
import { JolocomRegistry } from '../../registries/jolocomRegistry';

export class SignedCredentialRequest {
  private header: IJWTHeader = {
    typ: 'JWT',
    alg: 'ES256K'
  }

  private payload: ISignedCredRequestPayload

  private signature: string

  private computeSignature(privateKey: Buffer) {
    return computeJWTSignature(this.payload, privateKey)
  }

  public getCredentialRequest(): CredentialRequest {
    return this.payload.credentialRequest
  }

  public getIssueTime(): number {
    return this.payload.iat
  }

  public getCallbackURL(): string {
    return this.payload.credentialRequest.getCallbackURL()
  }

  public getRequestedCredentialTypes(): string[][] {
    return this.payload.credentialRequest.getRequestedCredentialTypes()
  }

  public getIssuer(): string {
    return this.payload.iss
  }

  public getSignature(): string {
    return this.signature
  }

  public static create(args: ISignedCredRequestCreationArgs): SignedCredentialRequest {
    const { privateKey, credentialRequest } = args
    let { issuer } = args

    if (!issuer) {
      issuer = privateKeyToDID(privateKey)
    }

    const signedCr = new SignedCredentialRequest()
    signedCr.payload = {
      iat: Date.now(),
      iss: issuer,
      credentialRequest
    }

    signedCr.signature = signedCr.computeSignature(privateKey)
    return signedCr
  }

  public validateSignatureWithPublicKey(pubKey: Buffer): boolean {
    if (!pubKey) {
      throw new Error('Please provide the issuer\'s public key')
    }
    const assembledJWT = this.toJWT()
    return new TokenVerifier(this.header.alg, pubKey.toString('hex')).verify(assembledJWT)
  }

  public async validateSignature(registry?: JolocomRegistry): Promise<boolean> {
    if (!registry) {
      throw new Error('Can not instantiate default registry yet, WIP')
    }

    const issuerProfile = await registry.resolve(this.payload.iss)

    // TODO Find based on key id
    const pubKey = issuerProfile.publicKey[0].publicKeyHex

    if (!pubKey) {
      return false
    }

    return this.validateSignatureWithPublicKey(Buffer.from(pubKey, 'hex'))
  }

  public toJWT(): string {
    if (!this.payload.credentialRequest || !this.header || !this.signature) {
      throw new Error('The JWT is not complete, header / payload / signature are missing')
    }

    return encodeAsJWT(this.header, this.payload, this.signature)
  }

  public static fromJWT(jwt: string): SignedCredentialRequest {
    const json = decodeToken(jwt)
    return SignedCredentialRequest.fromJSON(json)
  }

  public toJSON(): ISignedCredentialRequestAttrs {
    return classToPlain(this) as ISignedCredentialRequestAttrs
  }

  public static fromJSON(json: ISignedCredentialRequestAttrs): SignedCredentialRequest {
    const signedCredentialReq = plainToClass(SignedCredentialRequest, json)
    signedCredentialReq.payload.credentialRequest = CredentialRequest.fromJSON(json.payload.credentialRequest)
    return signedCredentialReq
  }
}
