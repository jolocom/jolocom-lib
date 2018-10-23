export const credOfferRequestPayloadCreateArgs = {
  typ: 'credentialOfferRequest',
  credentialOffer: {
    challenge: 'wbfnk',
    callbackURL: 'https://test.de/external-cred',
    instant: true,
    requestedInput: {}
  }
}

export const credentialOfferCreateAttrs = {
  challenge: 'wbfnk',
  callbackURL: 'https://test.de/external-cred',
  instant: true,
  requestedInput: {}
}

export const credOfferResponsePayloadCreateArgs = {
  credentialOffer: {
    challenge: 'wbfnk',
    callbackURL: 'https://test.de/external-cred',
    instant: true,
    requestedInput: {}
  },
  typ: 'credentialOfferResponse'
}
