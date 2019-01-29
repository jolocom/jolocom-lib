import { classToPlain, plainToClass, Expose, Exclude } from 'class-transformer'
import { IPaymentResponseAttrs } from './interactionTokens.types'

/**
 * @class
 * Class representing a payment reponse. Encodable in JWT
 */

@Exclude()
export class PaymentResponse {
  private _txHash: string

  @Expose()
  get txHash(): string {
    return this._txHash
  }

  /**
   * Set the transaction hash
   * @example
   */

  set txHash(txHash: string) {
    this._txHash = txHash
  }

  /**
   * Serializes the {@link PaymentResponse} response as JSON-LD
   */

  public toJSON(): IPaymentResponseAttrs {
    return classToPlain(this) as IPaymentResponseAttrs
  }

  /**
   * Instantiates a {@link PaymentResponse} from it's JSON form
   * @param json - JSON encoded payment request / response
   */

  public static fromJSON(json: IPaymentResponseAttrs) {
    return plainToClass(this, json) as PaymentResponse
  }
}
