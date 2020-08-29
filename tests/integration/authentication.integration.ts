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
} from './identity.integration'
import { parseAndValidate } from '../../ts/parse/parseAndValidate'

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
  })

  it('Should allow for consumption of valid authentication request token by user', async () => {
    const decodedAuthRequest = await parseAndValidate.interactionToken(
      authRequestJWT.encode(),
      serviceIdentityWallet.identity
    ) as JSONWebToken<Authentication>

    expect(decodedAuthRequest.interactionToken).to.be.instanceOf(Authentication)

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
    const decodedAuthResponse = await parseAndValidate.interactionToken(
      authResponseEncoded,
      userIdentityWallet.identity
    ) as JSONWebToken<Authentication>

    expect(decodedAuthResponse.interactionToken).to.be.instanceOf(Authentication)
  })
})
