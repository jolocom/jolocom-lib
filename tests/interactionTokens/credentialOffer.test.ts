import { expect } from 'chai'
import { credentialOfferCreateAttrs } from '../data/interactionTokens/credentialOffer.data'
import {CredentialOfferRequest} from '../../ts/interactionTokens/credentialOfferRequest'

describe('CredentialOffer', () => {
  let credentialOffer: CredentialOfferRequest

  /* Implicitly tests toJSON too */

  it('Should implement static fromJSON', () => {
    credentialOffer = CredentialOfferRequest.fromJSON(
      credentialOfferCreateAttrs,
    )
    expect(credentialOffer.toJSON()).to.deep.eq(credentialOfferCreateAttrs)
  })

  it('Should implement getters method', () => {
    const {offeredCredentials, callbackURL} = credentialOfferCreateAttrs
    const [emailOffer] = offeredCredentials
    const {type: emailType, metadata, renderInfo, requestedInput} = emailOffer

    expect(credentialOffer.offeredCredentials).to.deep.eq(offeredCredentials)
    expect(credentialOffer.offeredTypes).to.deep.eq([emailType])
    expect(credentialOffer.getMetadataForType(emailType)).to.deep.eq(metadata)
    expect(credentialOffer.getRenderInfoForType(emailType)).to.deep.eq(renderInfo)
    expect(credentialOffer.getRequestedInputForType(emailType)).to.deep.eq(requestedInput)
    expect(credentialOffer.getOfferForType(emailType)).to.deep.eq(emailOffer)
    expect(credentialOffer.callbackURL).to.deep.eq( callbackURL)
  })
})
