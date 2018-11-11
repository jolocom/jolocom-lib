import { plainToClass, classToPlain, Expose, Exclude } from 'class-transformer'

export interface IAuthenticationAttrs {
  challenge: string
  callbackURL: string
}

/**
 * @class
 * Class containing a challenge string and callbackURL for challenge-response did authentication, 
 * encodable as a JWT
 * @ignore
 */

 @Exclude()
export class Authentication {
  private _challenge: string
  private _callbackURL: string

  /**
   * Get the challenge encoded in the payload
   * @example `console.log(authentication.challenge) // 'abcd'`
   */

  @Expose()
  get challenge(): string {
    return this._challenge
  }

  /**
   * Set the challenge encoded in the payload
   * @example `authentication.challenge = 'abcd'`
   */

  set challenge(challenge: string) {
    this._challenge = challenge
  }

  /**
   * Get the callback url encoded in the payload
   * @example `console.log(authentication.callbackURL) // 'http://example.com/auth'`
   */

  @Expose()
  get callbackURL (): string {
    return this._callbackURL
  }

  /**
   * Set the callback url encoded in the payload
   * @example `authentication.callbackURL = 'http://example.com/auth'`
   */

  set callbackURL(callbackURL: string) {
    this._callbackURL = callbackURL
  }

  /**
   * Serializes the {@link Authentication} request / response as JSON-LD
   */

  public toJSON() {
    return classToPlain(this)
  }

  /**
   * Instantiates a {@link Authentication} from it's JSON form
   * @param json - JSON encoded authentication request / response
   */

  public static fromJSON(json: IAuthenticationAttrs): Authentication {
    return plainToClass(this, json)
  }
}
