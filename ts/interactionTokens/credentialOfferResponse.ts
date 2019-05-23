import { classToPlain, plainToClass, Expose, Exclude } from 'class-transformer'
import {
  CredentialOfferResponseAttrs,
  CredentialOfferResponseSelection,
} from './interactionTokens.types'

/**
 * @class
 * Class representing a credential offer. Encodable in JWT
 */

@Exclude()
export class CredentialOfferResponse {
  private _callbackURL: string
  private _selectedCredentials: Array<CredentialOfferResponseSelection>

  /**
   * Get the callback url encoded in the payload
   * @example `console.log(offerResponse.callbackURL) // 'http://example.com/offer/redeem'`
   */

  @Expose()
  get callbackURL(): string {
    return this._callbackURL
  }

  /**
   * Set the callback url encoded in the payload
   * @example `offerResponse.callbackURL = 'http://example.com/offer/redeem'`
   */

  set callbackURL(callbackURL: string) {
    this._callbackURL = callbackURL
  }

  /**
   * Get an array of encoded {@link CredentialOfferResponse}
   * @example `console.log(offerResponse.offeredCredentials) // [{type: 'IdCardCredential', ...}, {...}]`
   */

  @Expose()
  get selectedCredentials(): Array<CredentialOfferResponseSelection> {
    return this._selectedCredentials
  }

  /**
   * Serializes the {@link CredentialOfferRequest} request / response as JSON-LD
   */

  public toJSON(): CredentialOfferResponseAttrs {
    return classToPlain(this) as CredentialOfferResponseAttrs
  }

  /**
   * Instantiates a {@link CredentialOfferRequest} from it's JSON form
   * @param json - JSON encoded authentication request / response
   */

  public static fromJSON(
    json: CredentialOfferResponseAttrs,
  ): CredentialOfferResponse {
    return plainToClass(this, json) as CredentialOfferResponse
  }
}
