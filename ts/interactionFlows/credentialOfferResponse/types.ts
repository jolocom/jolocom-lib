import { ICredentialOfferCreationAttrs } from '../credentialOfferRequest/types'

export interface ICredentialOfferResPayloadCreationAttrs {
  iss?: string
  typ: string
  credentialOffer: ICredentialOfferCreationAttrs
}