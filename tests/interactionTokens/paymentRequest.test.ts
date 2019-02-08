import { expect } from 'chai'
import { PaymentRequest } from '../../ts/interactionTokens/paymentRequest'
import { testPaymentRequestJSON } from '../data/interactionTokens/paymentRequest.data'

describe('PaymentRequest', () => {
  let paymentRequest: PaymentRequest

  it('Should implement static fromJSON', () => {
    paymentRequest = PaymentRequest.fromJSON(testPaymentRequestJSON)
    expect(paymentRequest.toJSON()).to.deep.eq(testPaymentRequestJSON)
    expect(paymentRequest).to.be.instanceOf(PaymentRequest)
  })

  it('Should implement getters on class', () => {
    expect(paymentRequest.callbackURL).to.equal(testPaymentRequestJSON.callbackURL)
    expect(paymentRequest.description).to.equal(testPaymentRequestJSON.description)
    expect(paymentRequest.transactionDetails).to.deep.equal(testPaymentRequestJSON.transactionDetails)
  })
})
