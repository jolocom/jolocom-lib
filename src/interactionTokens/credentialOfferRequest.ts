import { classToPlain, plainToClass, Expose, Exclude } from 'class-transformer'
import {
  CredentialOffer,
  CredentialOfferInputRequest,
  CredentialOfferMetadata,
  CredentialOfferRenderInfo,
  CredentialOfferRequestAttrs,
} from './interactionTokens.types'

/**
 * @class
 * Class representing a credential offer. Encodable in JWT
 */

@Exclude()
export class CredentialOfferRequest {
  private _callbackURL!: string
  private _offeredCredentials!: CredentialOffer[]

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
   * Get an array of encoded {@link CredentialOffer}
   * @example `console.log(offer.offeredCredentials) // [{type: 'IdCardCredential', ...}, {...}]`
   */

  @Expose()
  get offeredCredentials(): CredentialOffer[] {
    return this._offeredCredentials
  }

  /**
   * Set the array of {@link CredentialOffer} encoded in this interaction token
   * @example `offer.offeredCredentials = [{type: 'IdCardCredential', ...}, {...}]`
   */

  set offeredCredentials(offeredCredentials: CredentialOffer[]) {
    this._offeredCredentials = offeredCredentials
  }

  /**
   * Returns the corresponding {@link CredentialOfferRenderInfo} section given an offer type
   * @example `console.log(offer.getRenderInfoForType('IdCardCredential')) // {...}
   */

  getRenderInfoForType(type: string): CredentialOfferRenderInfo | undefined {
    return this.getOfferForType(type)?.renderInfo
  }

  /**
   * Returns the corresponding {@link CredentialOfferMetadata} section given an credential type
   * @example `console.log(offer.getMetadataForType('IdCardCredential')) // {...}
   */

  getMetadataForType(type: string): CredentialOfferMetadata | undefined {
    return this.getOfferForType(type)?.metadata
  }

  /**
   * Returns the corresponding {@link CredentialOfferInputRequest} section given an credential type
   * @example `console.log(offer.getRequestedInputForType('IdCardCredential')) // {...}
   */

  getRequestedInputForType(
    type: string,
  ): CredentialOfferInputRequest | undefined {
    return this.getOfferForType(type)?.requestedInput
  }

  /**
   * Returns the corresponding full {@link CredentialOffer} given a credential type
   * @example `console.log(offer.getOfferByType('IdCardCredential')) // {...}
   */

  getOfferForType(type: string): CredentialOffer | undefined {
    return this.offeredCredentials.find(offer => offer.type === type)
  }

  /**
   * Returns all credential types provided by the current {@link CredentialOffer}
   * @example `console.log(offer.getOfferedTypes()) // ['IdCardCredential', ...]
   */

  get offeredTypes() {
    return this.offeredCredentials.map(({ type }) => type)
  }

  /**
   * Serializes the {@link CredentialOfferRequest} request / response as JSON-LD
   */

  public toJSON(): CredentialOfferRequestAttrs {
    return classToPlain(this) as CredentialOfferRequestAttrs
  }

  /**
   * Instantiates a {@link CredentialOfferRequest} from it's JSON form
   * @param json - JSON encoded authentication request / response
   */

  public static fromJSON(json: CredentialOfferRequestAttrs) {
    return plainToClass(this, json) as CredentialOfferRequest
  }
}
