import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { userPass, servicePass } from './integration.data'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { keyIdToDid } from '../../ts/utils/helper'
import { jsonAuthentication } from '../data/interactionTokens/authentication.data'
import { Authentication } from '../../ts/interactionTokens/authentication'
import {
  userIdentityWallet,
  serviceIdentityWallet,
  localDidMethod
} from './identity.integration'

chai.use(sinonChai)
const expect = chai.expect

describe('Integration Test - Token interaction flow Authentication', () => {
  let authRequestJWT: JSONWebToken<Authentication>
  let authResponseEncoded: string

  it('Should correctly create an authentication request token by service', async () => {
    authRequestJWT = await serviceIdentityWallet.create.interactionTokens.request.auth(
      jsonAuthentication,
      servicePass,
    ) as JSONWebToken<Authentication>

    expect(authRequestJWT.interactionToken).to.deep.eq(
      Authentication.fromJSON(jsonAuthentication)
    )

    return userIdentityWallet.validateJWT(
      authRequestJWT,
      undefined,
      localDidMethod.resolver
    )
  })

  it('Should allow for consumption of valid authentication request token by user', async () => {
    const decodedAuthRequest = JSONWebToken.decode<Authentication>(
      authRequestJWT.encode(),
    )

    expect(decodedAuthRequest.interactionToken).to.be.instanceOf(Authentication)

    try {
      await userIdentityWallet.validateJWT(
        decodedAuthRequest,
        undefined,
        localDidMethod.resolver
      )
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

    return serviceIdentityWallet.validateJWT(
      authResponseJWT,
      authRequestJWT,
      localDidMethod.resolver
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
        localDidMethod.resolver
      )
    } catch (err) {
      return expect(true).to.be.false
    }
  })
})
