import { plainToClass, classToPlain } from 'class-transformer'
import { IAuthenticationAttrs } from './types'

export class Authentication {
  public challenge: string
  public callbackURL: string

  public static create(attrs: IAuthenticationAttrs): Authentication {
    const auth = new Authentication()
    auth.challenge = attrs.challenge
    auth.callbackURL = attrs.callbackURL

    return auth
  }

  public getChallenge(): string {
    return this.challenge
  }

  public getCallbackURL(): string {
    return this.callbackURL
  }

  public toJSON() {
    return classToPlain(this)
  }

  public static fromJSON(json) {
    return plainToClass(Authentication, json)
  }
}