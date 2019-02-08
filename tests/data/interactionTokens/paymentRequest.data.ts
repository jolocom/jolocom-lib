export const testPaymentRequestJSON = {
  callbackURL: 'https://test.com/payment/pending',
  description: 'This is a payment for EV charging.',
  transactionDetails: {
    senderAddress: '0x8389B5a24a1c56aFAD7309EF3b8e04bBadC935c3',
    receiverAddress: '0x8389B5a24a1c56aFAD7309EF3b8e04bBadC935c2',
    amountInEther: '0.1'
  }
}
