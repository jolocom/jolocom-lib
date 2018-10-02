import { plainToClass, classToPlain, Type } from 'class-transformer'
import { IAuthenticationResponseAttrs, IChallengeResponse, IAuthenticationResponseCreationAttrs } from './types'
import { sign, verifySignature } from '../../utils/crypto'
import { IVerifiable, ISigner } from '../../registries/types';

export class AuthenticationResponse implements IVerifiable {
  public challengeResponse: IChallengeResponse

  public static create(attrs: IAuthenticationResponseCreationAttrs): AuthenticationResponse {
    const authResponse = new AuthenticationResponse()
    authResponse.challengeResponse = {
      challenge: attrs.challenge,
      did: attrs.did,
      keyId: attrs.keyId,
      signatureValue: ''
    }
    authResponse.generateSignature(attrs.privKey)

    return authResponse
  }

  public async validateSignatureWithPublicKey(pubKey: Buffer): Promise<boolean> {
    if (!pubKey) {
      throw new Error("Please provide the signers public key")
    }

    const sig = Buffer.from(this.challengeResponse.signatureValue, 'base64')

    return verifySignature(this.challengeResponse.challenge, pubKey, sig)
  }

  public getSigner(): ISigner {
    return {
      did: this.challengeResponse.did,
      keyId: this.challengeResponse.keyId
    }
  }

  public generateSignature(key: Buffer) {
    this.challengeResponse.signatureValue = sign(this.challengeResponse.challenge, key)
  }

  public toJSON(): IAuthenticationResponseAttrs {
    return classToPlain(this) as IAuthenticationResponseAttrs
  }

  public static fromJSON(json: IAuthenticationResponseAttrs): AuthenticationResponse {
    return plainToClass(AuthenticationResponse, json)
  }
}