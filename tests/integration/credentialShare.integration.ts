import * as chai from 'chai'
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
import {
  userIdentityWallet,
  serviceIdentityWallet,
} from './identity.integration'
import { parseAndValidate } from '../../ts/parse/parseAndValidate'

chai.use(require('sinon-chai'))
const expect = chai.expect

describe('Integration Test - Token interaction flow Credential Request and Response', () => {
  let credRequestJWT: JSONWebToken<CredentialRequest>
  let credRequestEncoded: string
  let credResponseEncoded: string

  it('Should correctly create a credential request token by service', async () => {
    credRequestJWT = await serviceIdentityWallet.create.interactionTokens.request.share(
      integrationCredRequestJSON,
      servicePass,
    ) as JSONWebToken<CredentialRequest>
    credRequestEncoded = credRequestJWT.encode()

    expect(credRequestJWT.interactionToken).to.deep.eq(
      CredentialRequest.fromJSON(integrationCredRequestJSON),
    )
    expect(credRequestJWT).to.be.instanceOf(JSONWebToken)
    expect(credRequestJWT.interactionToken).to.be.instanceOf(CredentialRequest)
  })

  it('Should allow for consumption of valid credential request token by user', async () => {
    const decodedCredRequest = await parseAndValidate.interactionToken(
      credRequestEncoded,
      serviceIdentityWallet.identity
    ) as JSONWebToken<CredentialRequest>

    expect(decodedCredRequest.interactionToken).to.be.instanceOf(
      CredentialRequest,
    )

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
    const decodedCredResponse = await parseAndValidate.interactionToken(
      credResponseEncoded,
      userIdentityWallet.identity
    ) as JSONWebToken<CredentialResponse>

    expect(decodedCredResponse.interactionToken).to.be.instanceOf(
      CredentialResponse,
    )

    return expect(
      decodedCredResponse.interactionToken.satisfiesRequest(
        credRequestJWT.interactionToken,
      ),
    ).to.be.true
  })
})
