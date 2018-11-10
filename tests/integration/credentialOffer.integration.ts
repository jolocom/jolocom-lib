import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { userPass, servicePass, emailCredJSON } from './integration.data'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { keyIdToDid } from '../../ts/utils/helper'
import { credentialOfferCreateAttrs } from '../data/interactionTokens/credentialOffer.data'
import { CredentialOffer } from '../../ts/interactionTokens/credentialOffer'
import { userIdentityWallet, serviceIdentityWallet, jolocomRegistry } from './identity.integration'
import { claimsMetadata } from 'cred-types-jolocom-core'
import { CredentialsReceive } from '../../ts/interactionTokens/credentialsReceive';

chai.use(sinonChai)
const expect = chai.expect

describe('Integration Test - Token interaction flow Credential Offer', () => {
  let credOfferRequestJWT
  let credOfferRequestEncoded
  let credOfferResponseJWT
  let credOfferResponseEncoded
  let credReceiveEncoded

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

    credOfferResponseJWT = await userIdentityWallet.create.interactionTokens.response.offer({
        callbackURL: decodedCredOfferRequest.getInteractionToken().getCallbackURL(),
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
  })

  it('Should correctly create a credential receive token by service', async () => {
    const decodedCredOfferResponse = JSONWebToken.decode<CredentialOffer>(credOfferResponseEncoded)
    const signedCredForUser = await serviceIdentityWallet.create.signedCredential(
      {
        metadata: claimsMetadata.emailAddress,
        subject: keyIdToDid(decodedCredOfferResponse.getIssuer()),
        claim: { email: emailCredJSON.claim.email }
      },
      servicePass
    )

    const credReceiveJWT = await serviceIdentityWallet.create.interactionTokens.response.issue(
      {
        signedCredentials: [signedCredForUser.toJSON()]
      },
      servicePass,
      decodedCredOfferResponse
    )
    credReceiveEncoded = credReceiveJWT.encode()

    expect(credReceiveJWT.getInteractionToken()).to.be.instanceOf(CredentialsReceive)
    expect(credReceiveJWT.getAudience()).to.eq(keyIdToDid(decodedCredOfferResponse.getIssuer()))
    expect(credReceiveJWT.getTokenNonce()).to.eq(decodedCredOfferResponse.getTokenNonce())
  })

  it('Should allow for consumtion of valid credential receive token by user', async () => {
    const decodedCredReceive = JSONWebToken.decode<CredentialsReceive>(credReceiveEncoded)
    expect(decodedCredReceive.getInteractionToken()).to.be.instanceOf(CredentialsReceive)

    try {
      await userIdentityWallet.validateJWT(decodedCredReceive, credOfferResponseJWT, jolocomRegistry)
    } catch (err) {
      expect(true).to.be.false
    }
    
    expect(decodedCredReceive.getInteractionToken().getSignedCredentials()[0].getSubject())
      .to.eq(userIdentityWallet.getDid())
  })
})
