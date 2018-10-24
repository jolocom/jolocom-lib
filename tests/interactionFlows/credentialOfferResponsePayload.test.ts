import { expect } from 'chai'
import { credOfferResponsePayloadCreateArgs } from '../data/interactionFlows/credentialOffer'
import { CredentialOffer } from '../../ts/interactionFlows/credentialOfferRequest/credentialOffer'
import {
  CredentialOfferResponsePayload
} from '../../ts/interactionFlows/credentialOfferResponse/credentialOfferResponsePayload'

describe('CredentialOfferResponsePayload', () => {
  const credOfferResponsePayload = CredentialOfferResponsePayload.create(credOfferResponsePayloadCreateArgs)

  it('Should implement static create method and return correct instance', () => {
    expect(credOfferResponsePayload).to.be.instanceOf(CredentialOfferResponsePayload)
    expect(credOfferResponsePayload.credentialOffer).to.be.instanceOf(CredentialOffer)
    // tslint:disable:no-unused-expression
    expect(credOfferResponsePayload.getCallbackURL).to.exist
    expect(credOfferResponsePayload.getChallenge).to.exist
    expect(credOfferResponsePayload.getRequestedInput).to.exist
    expect(credOfferResponsePayload.isInstant).to.exist
    // tslint:enable:no-unused-expression
  })

  it('Should implement toJSON method which returns a correct JSON', () => {
    expect(credOfferResponsePayload.toJSON()).to.deep.equal(credOfferResponsePayloadCreateArgs)
  })

  it('Should implement static fromJSON method & return correct instance CredentialOfferRequestPayload', () => {
    const credOfferResPayloadRevived = CredentialOfferResponsePayload.fromJSON(credOfferResponsePayloadCreateArgs)

    expect(credOfferResPayloadRevived).to.be.instanceOf(CredentialOfferResponsePayload)
    expect(credOfferResPayloadRevived.credentialOffer).to.be.instanceOf(CredentialOffer)
    expect(credOfferResPayloadRevived).to.deep.equal(credOfferResponsePayload)
  })
})
