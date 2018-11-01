import { plainToClass, classToPlain, Expose } from 'class-transformer'
import { IAuthenticationAttrs } from './authentication/types'

@Expose()
export class Authentication {
  private challenge: string
  private callbackURL: string

  public getChallenge(): string {
    return this.challenge
  }

  public getCallbackURL(): string {
    return this.callbackURL
  }

  public toJSON() {
    return classToPlain(this)
  }

  public static fromJSON(json: IAuthenticationAttrs): Authentication {
    return plainToClass(this, json)
  }
}
