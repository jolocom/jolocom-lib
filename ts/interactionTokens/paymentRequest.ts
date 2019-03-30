import { classToPlain, plainToClass, Expose, Exclude } from 'class-transformer'
import { IPaymentRequestAttrs, ITransactionOptions } from './interactionTokens.types'

/**
 * @class
 * Class representing a payment request for signing. Encodable in JWT
 */

@Exclude()
export class PaymentRequest {
  private _callbackURL: string
  private _transactionDetails: ITransactionOptions
  private _description: string

  @Expose()
  get transactionDetails(): ITransactionOptions {
    return this._transactionDetails
  }

  /**
   * Set the transaction details encoded in the payload
   * This will be used as input to create a transaction on receiver side
   * @example paymentRequest.transactionDetails = {
      receiverAddress: 'yourAddress',
      amountInEther: '0.1'
    }
   */

  set transactionDetails(
    transactionDetails: ITransactionOptions
  ) {
    this._transactionDetails = transactionDetails
  }

  @Expose()
  get description(): string {
    return this._description
  }

  /**
   * Set the description section encoded in the payload
   * @example paymentRequest.description = 'Payment for EV charging'
   */

  set description(description: string) {
    this._description = description
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
