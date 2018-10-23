export interface IOfferCreationAttrs {
  challenge: string
  callbackUrl: string
  instant: boolean
  requestedInput: {
    [key: string]: string | null
  }
}

export interface ICredentialOfferCreationArgs {
  iss?: string
  typ: string
  credentialOffer: IOfferCreationAttrs
}