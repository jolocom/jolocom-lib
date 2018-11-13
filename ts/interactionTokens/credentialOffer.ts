import { classToPlain, plainToClass, Expose, Exclude } from 'class-transformer'
import { ICredentialOfferAttrs } from './interactionTokens.types'

/* Class representing a credential offer. Encodable in JWT */

@Exclude()
export class CredentialOffer {
  private _challenge: string
  private _callbackURL: string
  private _instant: boolean
  private _requestedInput: {
    [key: string]: string | null
  }

  @Expose()
  get challenge() {
    return this._challenge
  }

  set challenge(challenge: string) {
    this._challenge = challenge
  }

  @Expose()
  get instant(): boolean {
    return this._instant
  }

  set instant(instant: boolean) {
    this._instant = instant
  }

  @Expose()
  get requestedInput(): { [key: string]: string | undefined } {
    return this._requestedInput
  }

  set requestedInput(requestedInput) {
    this._requestedInput = requestedInput
  }

  @Expose()
  get callbackURL(): string {
    return this._callbackURL
  }

  set callbackURL(callbackURL: string) {
    this._callbackURL = callbackURL
  }

  public toJSON() {
    return classToPlain(this)
  }

  public static fromJSON(json: ICredentialOfferAttrs) {
    return plainToClass(this, json) as CredentialOffer
  }
}
