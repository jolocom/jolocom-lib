import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { userPass, servicePass } from './integration.data'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { keyIdToDid } from '../../ts/utils/helper'
import { credentialOfferCreateAttrs } from '../data/interactionTokens/credentialOffer.data'
import { CredentialOffer } from '../../ts/interactionTokens/credentialOffer'
import { userIdentityWallet, serviceIdentityWallet, jolocomRegistry } from './identity.integration'

chai.use(sinonChai)
const expect = chai.expect

describe('Integration Test - Token interaction flow Credential Offer', () => {
  let credOfferRequestJWT
  let credOfferRequestEncoded
  let credOfferResponseEncoded

  it('Should correctly create a credential offer request token by service', async () => {
    credOfferRequestJWT = await serviceIdentityWallet.create.interactionTokens.request
      .offer(credentialOfferCreateAttrs, servicePass)
    credOfferRequestEncoded = credOfferRequestJWT.encode()

    expect(credOfferRequestJWT.getInteractionToken()).to.deep.eq(CredentialOffer.fromJSON(credentialOfferCreateAttrs))
    expect(credOfferRequestJWT).to.be.instanceOf(JSONWebToken)
    expect(credOfferRequestJWT.getInteractionToken()).to.be.instanceOf(CredentialOffer)
  })

  it('Should allow for consumption of valid credential request offer token by user', async () => {
    const decodedCredOfferRequest = JSONWebToken.decode<CredentialOffer>(credOfferRequestEncoded)
    expect(decodedCredOfferRequest.getInteractionToken()).to.be.instanceOf(CredentialOffer)

    try {
      await userIdentityWallet.validateJWT(decodedCredOfferRequest, null, jolocomRegistry)
    } catch (err) {
      expect(true).to.be.false
    }

    const credOfferResponseJWT = await userIdentityWallet.create.interactionTokens.response.offer({
        callbackURL: decodedCredOfferRequest.getInteractionToken().getCallbackURL(),
        challenge: decodedCredOfferRequest.getInteractionToken().getChallenge(),
        instant: decodedCredOfferRequest.getInteractionToken().isInstant(),
        requestedInput: {}
      },
      userPass,
      decodedCredOfferRequest
    )
    credOfferResponseEncoded = credOfferResponseJWT.encode()

    expect(credOfferResponseJWT.getInteractionToken()).to.be.instanceOf(CredentialOffer)
    expect(credOfferResponseJWT.getTokenNonce()).to.eq(decodedCredOfferRequest.getTokenNonce())
    expect(credOfferResponseJWT.getAudience()).to.eq(keyIdToDid(decodedCredOfferRequest.getIssuer()))
  })

  it('Should allow for consumption of valid credential offer response token by service', async () => {
    const decodedCredOfferResponse = JSONWebToken.decode<CredentialOffer>(credOfferResponseEncoded)
    expect(decodedCredOfferResponse.getInteractionToken()).to.be.instanceOf(CredentialOffer)

    try {
      await serviceIdentityWallet.validateJWT(decodedCredOfferResponse, credOfferRequestJWT, jolocomRegistry)
    } catch (err) {
      expect(true).to.be.false
    }
    
    // TODO: do we still need the challenge on Credential Offer?
    expect(decodedCredOfferResponse.getInteractionToken().getChallenge())
      .to.eq(credOfferRequestJWT.getInteractionToken().getChallenge())
  })

  // TODO: add credential receive as last step
})
