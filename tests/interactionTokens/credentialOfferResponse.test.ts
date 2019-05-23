import { expect } from 'chai'
import {
  credentialOfferRequestCreationArgs,
  credentialOfferResponseCreationArgs,
} from '../data/interactionTokens/credentialOffer.data'
import { CredentialOfferResponse } from '../../ts/interactionTokens/credentialOfferResponse'
import { CredentialOfferRequest } from '../../ts/interactionTokens/credentialOfferRequest'

describe('CredentialOfferResponse', () => {
  let credentialOfferResponse: CredentialOfferResponse

  /* Implicitly tests toJSON too */
  it('Should implement static fromJSON', () => {
    credentialOfferResponse = CredentialOfferResponse.fromJSON(
      credentialOfferResponseCreationArgs,
    )
    expect(credentialOfferResponse.toJSON()).to.deep.eq(
      credentialOfferResponseCreationArgs,
    )
  })

  it('Should correctly implement satisfiesRequest', () => {
    const credentialOfferRequest = CredentialOfferRequest.fromJSON(
      credentialOfferRequestCreationArgs,
    )
    const invalidCredentialOfferResponse = CredentialOfferResponse.fromJSON({
      ...credentialOfferRequestCreationArgs,
      selectedCredentials: [
        {
          type: 'InvalidCredential',
        },
      ],
    })
    const emptyCredentialOfferResponse = CredentialOfferResponse.fromJSON({
      ...credentialOfferRequestCreationArgs,
      selectedCredentials: [],
    })

    expect(
      invalidCredentialOfferResponse.satisfiesRequest(credentialOfferRequest),
    ).to.eq(false)
    expect(
      emptyCredentialOfferResponse.satisfiesRequest(credentialOfferRequest),
    ).to.be.eq(false)
    expect(
      credentialOfferResponse.satisfiesRequest(credentialOfferRequest),
    ).to.be.eq(true)
  })

  it('Should implement getters method', () => {
    const {
      selectedCredentials,
      callbackURL,
    } = credentialOfferResponseCreationArgs

    expect(credentialOfferResponse.callbackURL).to.deep.eq(callbackURL)
    expect(credentialOfferResponse.selectedCredentials).to.deep.eq(
      selectedCredentials,
    )
    expect(credentialOfferResponse.callbackURL).to.deep.eq(callbackURL)
  })
})
