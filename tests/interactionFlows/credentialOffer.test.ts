import { expect } from 'chai'
import { CredentialOffer } from '../../ts/interactionFlows/credentialOfferRequest/credentialOffer'
import { credentialOfferCreateAttrs } from '../data/interactionFlows/credentialOffer'

describe('CredentialOffer', () => {
  const credentialOffer = CredentialOffer.create(credentialOfferCreateAttrs)

  it('Should create instance of CredentialOffer on static create', () => {
    expect(credentialOffer).to.be.an.instanceOf(CredentialOffer)
    expect(credentialOffer).to.deep.equal(CredentialOffer.fromJSON(credentialOfferCreateAttrs))
    // tslint:disable:no-unused-expression
    expect(credentialOffer.getCallbackURL).to.exist
    expect(credentialOffer.getChallenge).to.exist
    expect(credentialOffer.getRequestedInput).to.exist
    expect(credentialOffer.isInstant).to.exist
    // tslint:enable:no-unused-expression
  })

  it('Should implement toJSON method', () => {
    expect(credentialOffer.toJSON()).to.deep.equal(credentialOfferCreateAttrs)
  })

  it('Should implement static fromJSON method', () => {
    const cOffer = CredentialOffer.fromJSON(credentialOfferCreateAttrs)

    expect(cOffer).to.be.instanceOf(CredentialOffer)
    expect(cOffer).to.deep.equal(credentialOffer)
  })
})
