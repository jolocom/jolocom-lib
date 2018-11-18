import { classToPlain, plainToClass, Expose, Exclude } from 'class-transformer'
import { ICredentialOfferAttrs } from './interactionTokens.types'

/**
 * @class
 * Class representing a credential offer. Encodable in JWT
 */

@Exclude()
export class CredentialOffer {
  private _callbackURL: string
  private _instant: boolean
  private _requestedInput: {
    [key: string]: string | null
  }

  /**
   * Get if the offered credential be retrieved instantly
   * @example `console.log(offer.instant) // true`
   */

  @Expose()
  get instant(): boolean {
    return this._instant
  }

  /**
   * Set if the offered credential be retrieved instantly
   * @example `offer.instant = true`
   */

  set instant(instant: boolean) {
    this._instant = instant
  }

  /**
   * Get the input requested in the offer
   * @example `console.log(offer.requestedInput) // { name: 'http://schema.org/name' }`
   */

  @Expose()
  get requestedInput(): { [key: string]: string | undefined } {
    return this._requestedInput
  }

  /**
   * Set the input requested in the offer
   * @example `offer.requestedInput = { name: 'http://schema.org/name' }`
   */

  set requestedInput(requestedInput) {
    this._requestedInput = requestedInput
  }

  /**
   * Get the callback url encoded in the payload
   * @example `console.log(offer.callbackURL) // 'http://example.com/offer/redeem'`
   */

  @Expose()
  get callbackURL(): string {
    return this._callbackURL
  }

  /**
   * Set the callback url encoded in the payload
   * @example `offer.callbackURL = 'http://example.com/offer/redeem'`
   */

  set callbackURL(callbackURL: string) {
    this._callbackURL = callbackURL
  }

  /**
   * Serializes the {@link CredentialOffer} request / response as JSON-LD
   */

  public toJSON(): ICredentialOfferAttrs {
    return classToPlain(this) as ICredentialOfferAttrs
  }

  /**
   * Instantiates a {@link CredentialOffer} from it's JSON form
   * @param json - JSON encoded authentication request / response
   */

  public static fromJSON(json: ICredentialOfferAttrs) {
    return plainToClass(this, json) as CredentialOffer
  }
}
