import { classToPlain, plainToClass, Expose, Exclude } from 'class-transformer'
import {
  CredentialOfferResponseAttrs,
  CredentialOfferResponseSelection,
  IInteractionToken,
  InteractionType,
} from './interactionTokens.types'
import { CredentialOfferRequest } from './credentialOfferRequest'

/**
 * @class
 * Class representing a credential offer. Encodable in JWT
 */

@Exclude()
export class CredentialOfferResponse implements IInteractionToken {
  @Expose({ toPlainOnly: true })
  readonly type = InteractionType.CredentialOfferResponse

  private _callbackURL: string
  private _selectedCredentials: CredentialOfferResponseSelection[]

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
  get selectedCredentials(): CredentialOfferResponseSelection[] {
    return this._selectedCredentials
  }

  /**
   * Set an array of {@link CredentialOfferResponse} to be included in the interaction token
   * @example `offerResponse.offeredCredentials = [{type: 'IdCardCredential', ...}, {...}]`
   */

  set selectedCredentials(
    selectedCredentials: CredentialOfferResponseSelection[],
  ) {
    this._selectedCredentials = selectedCredentials
  }

  /**
   * Evaluates if the credential offer response validates against the offer request
   * @dev Currently only evaluates if the correct credential types have been provided
   * validation of requestInputs is currently out of scope
   * @param credentialOfferRequest - {@link CredentialOfferRequest} to evaluate against
   * @example `credentialOfferResponse.satisfiesRequest(credentialOfferRequest) // true`
   */

  public satisfiesRequest({ offeredTypes }: CredentialOfferRequest): boolean {
    if (offeredTypes.length !== this.selectedCredentials.length) {
      return false
    }

    const selectedTypes = this.selectedCredentials.map(
      selected => selected.type,
    )
    return selectedTypes.every(requestedType =>
      offeredTypes.includes(requestedType),
    )
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
