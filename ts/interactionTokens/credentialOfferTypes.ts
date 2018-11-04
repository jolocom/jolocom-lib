export interface ICredentialOfferCreationAttrs {
  challenge: string
  callbackURL: string
  instant: boolean
  requestedInput: {
    [key: string]: string | null
  }
}
