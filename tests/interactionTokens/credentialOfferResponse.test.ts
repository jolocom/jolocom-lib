import { expect } from 'chai'
import {
  credentialOfferResponseCreationArgs
} from '../data/interactionTokens/credentialOffer.data'
import {CredentialOfferResponse} from '../../ts/interactionTokens/credentialOfferResponse'

describe('CredentialOfferResponse', () => {
  let credentialOfferResponse: CredentialOfferResponse

  /* Implicitly tests toJSON too */
  it('Should implement static fromJSON', () => {
    credentialOfferResponse = CredentialOfferResponse.fromJSON(
      credentialOfferResponseCreationArgs,
    )
    expect(credentialOfferResponse.toJSON()).to.deep.eq(credentialOfferResponseCreationArgs)
  })

  it('Should implement getters method', () => {
    const {selectedCredentials, callbackURL} = credentialOfferResponseCreationArgs

    expect(credentialOfferResponse.callbackURL).to.deep.eq(callbackURL)
    expect(credentialOfferResponse.selectedCredentials).to.deep.eq(selectedCredentials)
    expect(credentialOfferResponse.callbackURL).to.deep.eq(callbackURL)
  })
})
