import { expect } from 'chai'
import { credentialOfferRequestCreationArgs } from '../data/interactionTokens/credentialOffer.data'
import { CredentialOfferRequest } from '../../ts/interactionTokens/credentialOfferRequest'

describe('CredentialOfferRequest', () => {
  let credentialOfferRequest: CredentialOfferRequest

  /* Implicitly tests toJSON too */

  it('Should implement static fromJSON', () => {
    credentialOfferRequest = CredentialOfferRequest.fromJSON(
      credentialOfferRequestCreationArgs,
    )
    expect(credentialOfferRequest.toJSON()).to.deep.eq(
      credentialOfferRequestCreationArgs,
    )
  })

  it('Should implement getters method', () => {
    const {
      offeredCredentials,
      callbackURL,
    } = credentialOfferRequestCreationArgs
    const [emailOffer] = offeredCredentials
    const { type: emailType, metadata, renderInfo, requestedInput } = emailOffer

    expect(credentialOfferRequest.offeredCredentials).to.deep.eq(
      offeredCredentials,
    )
    expect(credentialOfferRequest.offeredTypes).to.deep.eq([emailType])
    expect(credentialOfferRequest.getMetadataForType(emailType)).to.deep.eq(
      metadata,
    )
    expect(credentialOfferRequest.getRenderInfoForType(emailType)).to.deep.eq(
      renderInfo,
    )
    expect(
      credentialOfferRequest.getRequestedInputForType(emailType),
    ).to.deep.eq(requestedInput)
    expect(credentialOfferRequest.getOfferForType(emailType)).to.deep.eq(
      emailOffer,
    )
    expect(credentialOfferRequest.callbackURL).to.deep.eq(callbackURL)
  })
})
