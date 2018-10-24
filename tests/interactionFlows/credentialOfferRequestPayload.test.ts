import { expect } from 'chai'
import { credOfferRequestPayloadCreateArgs } from '../data/interactionFlows/credentialOffer'
import { CredentialOffer } from '../../ts/interactionFlows/credentialOfferRequest/credentialOffer'
import {
  CredentialOfferRequestPayload
} from '../../ts/interactionFlows/credentialOfferRequest/credentialOfferRequestPayload'

describe('CredentialOfferRequestPayload', () => {
  const credOfferRequestPayload = CredentialOfferRequestPayload.create(credOfferRequestPayloadCreateArgs)

  it('Should implement static create method and return correct instance', () => {
    expect(credOfferRequestPayload).to.be.instanceOf(CredentialOfferRequestPayload)
    expect(credOfferRequestPayload.credentialOffer).to.be.instanceOf(CredentialOffer)
    // tslint:disable:no-unused-expression
    expect(credOfferRequestPayload.getCallbackURL).to.exist
    expect(credOfferRequestPayload.getChallenge).to.exist
    expect(credOfferRequestPayload.getRequestedInput).to.exist
    expect(credOfferRequestPayload.isInstant).to.exist
    // tslint:enable:no-unused-expression
  })

  it('Should implement toJSON method which returns a correct JSON', () => {
    expect(credOfferRequestPayload.toJSON()).to.deep.equal(credOfferRequestPayloadCreateArgs)
  })

  it('Should implement static fromJSON method & return correct instance CredentialOfferRequestPayload', () => {
    const credOfferReqPayloadRevived = CredentialOfferRequestPayload.fromJSON(credOfferRequestPayloadCreateArgs)

    expect(credOfferReqPayloadRevived).to.be.instanceOf(CredentialOfferRequestPayload)
    expect(credOfferReqPayloadRevived.credentialOffer).to.be.instanceOf(CredentialOffer)
    expect(credOfferReqPayloadRevived).to.deep.equal(credOfferRequestPayload)
  })
})
