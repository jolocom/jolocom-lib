import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { userPass, servicePass } from './integration.data'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { keyIdToDid } from '../../ts/utils/helper'
import { jsonAuthentication } from '../data/interactionTokens/authentication.data'
import { Authentication } from '../../ts/interactionTokens/authentication'
import { userIdentityWallet, serviceIdentityWallet, jolocomRegistry } from './identity.integration'

chai.use(sinonChai)
const expect = chai.expect

describe('Integration Test - Token interaction flow Authentication', () => {
  let authRequestJWT
  let authRequestEncoded
  let authResponseEncoded

  it('Should correctly create an authentication request token by service', async () => {
    authRequestJWT = await serviceIdentityWallet.create.interactionTokens.request
      .auth(jsonAuthentication, servicePass)
    authRequestEncoded = authRequestJWT.encode()

    expect(authRequestJWT.getInteractionToken()).to.deep.eq(Authentication.fromJSON(jsonAuthentication))
    expect(authRequestJWT).to.be.instanceOf(JSONWebToken)
    expect(authRequestJWT.getInteractionToken()).to.be.instanceOf(Authentication)
  })

  it('Should allow for consumption of valid authentication request token by user', async () => {
    const decodedAuthRequest = JSONWebToken.decode<Authentication>(authRequestEncoded)
    expect(decodedAuthRequest.getInteractionToken()).to.be.instanceOf(Authentication)

    try {
      await userIdentityWallet.validateJWT(decodedAuthRequest, null, jolocomRegistry)
    } catch (err) {
      expect(true).to.be.false
    }

    const authResponseJWT = await userIdentityWallet.create.interactionTokens.response.auth(
      {
        callbackURL: decodedAuthRequest.getInteractionToken().getCallbackURL(),
        // TODO: do we still need the challenge?
        challenge: decodedAuthRequest.getInteractionToken().getChallenge()
      },
      userPass,
      decodedAuthRequest
    )
    authResponseEncoded = authResponseJWT.encode()

    expect(authResponseJWT.getInteractionToken()).to.be.instanceOf(Authentication)
    expect(authResponseJWT.getTokenNonce()).to.eq(decodedAuthRequest.getTokenNonce())
    expect(authResponseJWT.getAudience()).to.eq(keyIdToDid(decodedAuthRequest.getIssuer()))
  })

  it('Should allow for consumption of valid authentication response token by service', async () => {
    const decodedAuthResponse = JSONWebToken.decode<Authentication>(authResponseEncoded)
    expect(decodedAuthResponse.getInteractionToken()).to.be.instanceOf(Authentication)

    try {
      await serviceIdentityWallet.validateJWT(decodedAuthResponse, authRequestJWT, jolocomRegistry)
    } catch (err) {
      expect(true).to.be.false
    }
    
    expect(decodedAuthResponse.getInteractionToken().getChallenge())
      .to.eq(authRequestJWT.getInteractionToken().getChallenge())
  })
})
