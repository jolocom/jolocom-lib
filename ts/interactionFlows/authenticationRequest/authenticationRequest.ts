import { plainToClass, classToPlain } from 'class-transformer'
import { IAuthenticationRequestAttrs } from './types'

export class AuthenticationRequest {
  private challenge: string
  private callbackURL: string

  public static create(attrs: IAuthenticationRequestAttrs): AuthenticationRequest {
    const authReq = new AuthenticationRequest()
    authReq.challenge = attrs.challenge
    authReq.callbackURL = attrs.callbackURL

    return authReq
  }

  public getChallenge(): string {
    return this.challenge
  }

  public getCallbackURL(): string {
    return this.callbackURL
  }

  public toJSON(): IAuthenticationRequestAttrs {
    return classToPlain(this) as IAuthenticationRequestAttrs
  }

  public static fromJSON(json: IAuthenticationRequestAttrs): AuthenticationRequest {
    return plainToClass(AuthenticationRequest, json)
  }
}
