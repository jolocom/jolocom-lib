import { plainToClass, classToPlain, Expose, Exclude } from 'class-transformer'

/* TODO CLEAN UP */
export interface IAuthenticationAttrs {
  challenge: string
  callbackURL: string
}

/**
 * @class
 * Class containing a challenge string and callbackURL for challenge-response did authentication, encodable in JWT
 */

 @Exclude()
export class Authentication {
  private _challenge: string
  private _callbackURL: string

  @Expose()
  get challenge(): string {
    return this._challenge
  }

  set challenge(challenge: string) {
    this._challenge = challenge
  }

  @Expose()
  get callbackURL (): string {
    return this._callbackURL
  }

  set callbackURL(callbackURL: string) {
    this._callbackURL = callbackURL
  }

  public toJSON() {
    return classToPlain(this)
  }

  public static fromJSON(json: IAuthenticationAttrs): Authentication {
    return plainToClass(this, json)
  }
}
