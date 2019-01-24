import { classToPlain, plainToClass, Expose, Exclude } from 'class-transformer'
import { IPaymentRequestAttrs } from './interactionTokens.types'
import { ICreateEthTransactionAttrs } from '../ethereum/types'
 
export type PaymentRequestDetails = {
  description: string,
  transactionDetails: ICreateEthTransactionAttrs
}

/**
 * @class
 * Class representing a payment request for signing. Encodable in JWT
 */

@Exclude()
export class PaymentRequest {
  private _callbackURL: string
  private _transactionDetails: ICreateEthTransactionAttrs
  private _description: string

  /**
   * Get the requested payment details
   */

  @Expose()
  get paymentRequestDetails(): PaymentRequestDetails {
    return {
      description: this._description,
      transactionDetails: this._transactionDetails
    }
  }

  /**
   * Get the callback url encoded in the payload
   * @example `console.log(paymentRequest.callbackURL) // 'http://example.com/payment/pending'`
   */

  @Expose()
  get callbackURL(): string {
    return this._callbackURL
  }

  /**
   * Set the callback url encoded in the payload
   * @example `paymentRequest.callbackURL = 'http://example.com/payment/pending'`
   */

  set callbackURL(callbackURL: string) {
    this._callbackURL = callbackURL
  }

  /**
   * Serializes the {@link PaymentRequest} request as JSON-LD
   */

  public toJSON(): IPaymentRequestAttrs {
    return classToPlain(this) as IPaymentRequestAttrs
  }

  /**
   * Instantiates a {@link PaymentRequest} from it's JSON form
   * @param json - JSON encoded payment request / response
   */

  public static fromJSON(json: IPaymentRequestAttrs) {
    return plainToClass(this, json) as PaymentRequest
  }
}
