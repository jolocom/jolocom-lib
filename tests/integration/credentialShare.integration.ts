import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {
  userPass,
  servicePass,
  integrationCredRequestJSON,
  emailCredJSON,
} from './integration.data'
import { CredentialRequest } from '../../ts/interactionTokens/credentialRequest'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { CredentialResponse } from '../../ts/interactionTokens/credentialResponse'
import { keyIdToDid } from '../../ts/utils/helper'
import { DependencyIndex } from './index'

chai.use(sinonChai)
const expect = chai.expect

export const credentialShare = (
  dependencies: Partial<DependencyIndex>,
) => () => {
  let credRequestJWT
  let credRequestEncoded
  let credResponseEncoded

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

  it('Should correctly create a credential request token by service', async () => {
    credRequestJWT = await serviceIdentityWallet.create.interactionTokens.request.share(
      integrationCredRequestJSON,
      servicePass,
    )
    credRequestEncoded = credRequestJWT.encode()

    expect(credRequestJWT.interactionToken).to.deep.eq(
      CredentialRequest.fromJSON(integrationCredRequestJSON),
    )
    expect(credRequestJWT).to.be.instanceOf(JSONWebToken)
    expect(credRequestJWT.interactionToken).to.be.instanceOf(CredentialRequest)
  })

  it('Should allow for consumption of valid credential request token by user', async () => {
    const decodedCredRequest = JSONWebToken.decode<CredentialRequest>(
      credRequestEncoded,
    )
    expect(decodedCredRequest.interactionToken).to.be.instanceOf(
      CredentialRequest,
    )

    try {
      await userIdentityWallet.validateJWT(decodedCredRequest, null, resolver)
    } catch (err) {
      return expect(true).to.be.false
    }

    const emailSignedCred = await userIdentityWallet.create.signedCredential(
      emailCredJSON,
      userPass,
    )

    const credResponseJWT = await userIdentityWallet.create.interactionTokens.response.share(
      {
        callbackURL: decodedCredRequest.interactionToken.callbackURL,
        suppliedCredentials: [emailSignedCred.toJSON()],
      },
      userPass,
      decodedCredRequest,
    )
    credResponseEncoded = credResponseJWT.encode()

    expect(credResponseJWT.interactionToken).to.be.instanceOf(
      CredentialResponse,
    )
    expect(credResponseJWT.nonce).to.eq(decodedCredRequest.nonce)
    expect(credResponseJWT.audience).to.eq(
      keyIdToDid(decodedCredRequest.issuer),
    )
  })

  it('Should allow for consumption of valid credential response token by service', async () => {
    const decodedCredResponse = JSONWebToken.decode<CredentialResponse>(
      credResponseEncoded,
    )
    expect(decodedCredResponse.interactionToken).to.be.instanceOf(
      CredentialResponse,
    )

    try {
      await serviceIdentityWallet.validateJWT(
        decodedCredResponse,
        credRequestJWT,
        resolver,
      )
    } catch (err) {
      return expect(true).to.be.false
    }

    return expect(
      decodedCredResponse.interactionToken.satisfiesRequest(
        credRequestJWT.interactionToken,
      ),
    ).to.be.true
  })
}
