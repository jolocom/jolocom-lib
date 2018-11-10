import { plainToClass, classToPlain, Expose } from 'class-transformer'
import { IAuthenticationAttrs } from './interactionTokens.types'

/*
 * Class representing a challenge string and callback url for challenge-response
 * authentication did authentication, encodable in JWT
 *
 * Currently unused
 */

@Expose()
export class Authentication {
  private callbackURL: string

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
