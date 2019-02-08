import { expect } from 'chai'
import { PaymentResponse } from '../../ts/interactionTokens/paymentResponse'

describe('PaymentResponse', () => {
  let paymentResponse: PaymentResponse

  it('Should correctly implement fromJSON', () => {
    paymentResponse = PaymentResponse.fromJSON({ txHash: '0x45DF' })
    expect(paymentResponse).to.be.instanceOf(PaymentResponse)
    expect(paymentResponse.toJSON()).to.deep.equal({ txHash: '0x45DF' })
  })

  it('Should expose getter', () => {
    expect(paymentResponse.txHash).to.equal('0x45DF')
  })
})
