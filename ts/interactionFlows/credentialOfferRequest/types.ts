export interface ICredentialOfferCreationAttrs {
  challenge: string
  callbackUrl: string
  instant: boolean
  requestedInput: {
    [key: string]: string | null
  }
}

export interface ICredentialOfferReqPayloadCreationAttrs {
  iss?: string
  typ: string
  credentialOffer: ICredentialOfferCreationAttrs
}