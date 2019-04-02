import { expect } from 'chai'
import { credentialOfferCreateAttrs } from '../data/interactionTokens/credentialOffer.data'
import { CredentialOffer } from '../../ts/interactionTokens/credentialOffer'

describe('CredentialOffer', () => {
  let credentialOffer: CredentialOffer

  /* Implicitly tests toJSON too */

  it('Should implement static fromJSON', () => {
    credentialOffer = CredentialOffer.fromJSON(credentialOfferCreateAttrs)
    expect(credentialOffer.toJSON()).to.deep.eq(credentialOfferCreateAttrs)
  })

  it('Should implement getters method', () => {
    expect(credentialOffer.callbackURL).to.eq(
      credentialOfferCreateAttrs.callbackURL,
    )
    expect(credentialOffer.requestedInput).to.deep.eq(
      credentialOfferCreateAttrs.requestedInput,
    )
    expect(credentialOffer.instant).to.deep.eq(
      credentialOfferCreateAttrs.instant,
    )
  })
})
