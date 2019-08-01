import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { userPass, servicePass } from './integration.data'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { keyIdToDid } from '../../ts/utils/helper'
import { jsonAuthentication } from '../data/interactionTokens/authentication.data'
import { Authentication } from '../../ts/interactionTokens/authentication'
import { DependencyIndex } from './index'

chai.use(sinonChai)
const expect = chai.expect

export const authenticationRequest = (
  dependencies: Partial<DependencyIndex>,
) => () => {
  let authRequestJWT
  let authRequestEncoded
  let authResponseEncoded

  let jolocomRegistry
  let userIdentityWallet
  let serviceIdentityWallet
  let resolver

  before(() => {
    resolver = dependencies.resolver
    jolocomRegistry = dependencies.jolocomRegistry
    userIdentityWallet = dependencies.userIdentityWallet
    serviceIdentityWallet = dependencies.serviceIdentityWallet
  })

  it('Should correctly create an authentication request token by service', async () => {
    authRequestJWT = await serviceIdentityWallet.create.interactionTokens.request.auth(
      jsonAuthentication,
      servicePass,
    )
    authRequestEncoded = authRequestJWT.encode()

    expect(authRequestJWT.interactionToken).to.deep.eq(
      Authentication.fromJSON(jsonAuthentication),
    )
    expect(authRequestJWT).to.be.instanceOf(JSONWebToken)
    expect(authRequestJWT.interactionToken).to.be.instanceOf(Authentication)
  })

  it('Should allow for consumption of valid authentication request token by user', async () => {
    const decodedAuthRequest = JSONWebToken.decode<Authentication>(
      authRequestEncoded,
    )
    expect(decodedAuthRequest.interactionToken).to.be.instanceOf(Authentication)

    try {
      await userIdentityWallet.validateJWT(decodedAuthRequest, null, resolver)
    } catch (err) {
      return expect(true).to.be.false
    }

    const authResponseJWT = await userIdentityWallet.create.interactionTokens.response.auth(
      {
        callbackURL: decodedAuthRequest.interactionToken.callbackURL,
        description: decodedAuthRequest.interactionToken.description,
      },
      userPass,
      decodedAuthRequest,
    )
    authResponseEncoded = authResponseJWT.encode()

    expect(authResponseJWT.interactionToken).to.be.instanceOf(Authentication)
    expect(authResponseJWT.nonce).to.eq(decodedAuthRequest.nonce)
    expect(authResponseJWT.audience).to.eq(
      keyIdToDid(decodedAuthRequest.issuer),
    )
  })

  it('Should allow for consumption of valid authentication response token by service', async () => {
    const decodedAuthResponse = JSONWebToken.decode<Authentication>(
      authResponseEncoded,
    )
    expect(decodedAuthResponse.interactionToken).to.be.instanceOf(
      Authentication,
    )

    try {
      await serviceIdentityWallet.validateJWT(
        decodedAuthResponse,
        authRequestJWT,
        resolver,
      )
    } catch (err) {
      return expect(true).to.be.false
    }
  })
}
