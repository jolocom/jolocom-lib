import * as chai from 'chai'
import { userPass, servicePass, emailCredJSON } from './integration.data'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { keyIdToDid } from '../../ts/utils/helper'
import {
  credentialOfferRequestCreationArgs,
  credentialOfferResponseCreationArgs,
} from '../data/interactionTokens/credentialOffer.data'
import {
  userIdentityWallet,
  serviceIdentityWallet,
  localDidMethod
} from './identity.integration'
import { claimsMetadata } from '@jolocom/protocol-ts'
import { CredentialsReceive } from '../../ts/interactionTokens/credentialsReceive'
import { CredentialOfferRequest } from '../../ts/interactionTokens/credentialOfferRequest'
import { CredentialOfferResponse } from '../../ts/interactionTokens/credentialOfferResponse'
import { validateDigestable } from '../../ts/utils/validation'
import { parseAndValidate } from '../../ts/parse/parseAndValidate'

chai.use(require("sinon-chai"))
const expect = chai.expect

describe('Integration Test - Token interaction flow Credential Offer', () => {
  let credOfferRequestJWT: JSONWebToken<CredentialOfferRequest>
  let credOfferRequestEncoded: string
  let credOfferResponseJWT: JSONWebToken<CredentialOfferResponse>
  let credOfferResponseEncoded: string
  let credReceiveEncoded: string

  it('Should correctly create a credential offer request token by service', async () => {
    credOfferRequestJWT = await serviceIdentityWallet.create.interactionTokens.request.offer(
      credentialOfferRequestCreationArgs,
      servicePass,
    ) as JSONWebToken<CredentialOfferRequest>

    credOfferRequestEncoded = credOfferRequestJWT.encode()

    expect(credOfferRequestJWT.interactionToken).to.deep.eq(
      CredentialOfferRequest.fromJSON(credentialOfferRequestCreationArgs),
    )
    expect(credOfferRequestJWT).to.be.instanceOf(JSONWebToken)
    expect(credOfferRequestJWT.interactionToken).to.be.instanceOf(
      CredentialOfferRequest,
    )
  })

  it('Should allow for consumption of valid credential offer request token by user', async () => {
    const decodedCredOfferRequest = await parseAndValidate.interactionToken(
      credOfferRequestEncoded,
      serviceIdentityWallet.identity
    ) as JSONWebToken<CredentialOfferRequest>

    expect(decodedCredOfferRequest.interactionToken).to.be.instanceOf(
      CredentialOfferRequest,
    )

    credOfferResponseJWT = await userIdentityWallet.create.interactionTokens.response.offer(
      credentialOfferResponseCreationArgs,
      userPass,
      decodedCredOfferRequest,
    ) as JSONWebToken<CredentialOfferResponse>

    credOfferResponseEncoded = credOfferResponseJWT.encode()

    expect(credOfferResponseJWT.interactionToken).to.be.instanceOf(
      CredentialOfferResponse,
    )

    expect(credOfferResponseJWT.nonce).to.eq(decodedCredOfferRequest.nonce)
    expect(credOfferResponseJWT.audience).to.eq(
      keyIdToDid(decodedCredOfferRequest.issuer),
    )
  })

  it('Should correctly create a credential receive token by service', async () => {
    const decodedCredOfferResponse = await parseAndValidate.interactionToken(
      credOfferResponseEncoded,
      userIdentityWallet.identity
    ) as JSONWebToken<CredentialOfferResponse>

    expect(decodedCredOfferResponse.interactionToken).to.be.instanceOf(CredentialOfferResponse)

    const signedCredForUser = await serviceIdentityWallet.create.signedCredential(
      {
        metadata: claimsMetadata.emailAddress,
        subject: keyIdToDid(decodedCredOfferResponse.issuer),
        claim: { email: emailCredJSON.claim.email },
      },
      servicePass,
    )

    const credReceiveJWT = await serviceIdentityWallet.create.interactionTokens.response.issue(
      {
        signedCredentials: [signedCredForUser.toJSON()],
      },
      servicePass,
      decodedCredOfferResponse,
    )
    credReceiveEncoded = credReceiveJWT.encode()

    expect(credReceiveJWT.interactionToken).to.be.instanceOf(CredentialsReceive)
    expect(credReceiveJWT.audience).to.eq(
      keyIdToDid(decodedCredOfferResponse.issuer),
    )
    expect(credReceiveJWT.nonce).to.eq(decodedCredOfferResponse.nonce)
  })

  it('Should allow for consumtion of valid credential receive token by user', async () => {
    const decodedCredReceive = await parseAndValidate.interactionToken(
      credReceiveEncoded,
      serviceIdentityWallet.identity
    ) as JSONWebToken<CredentialsReceive>

    expect(decodedCredReceive.interactionToken).to.be.instanceOf(
      CredentialsReceive,
    )

    expect(
      decodedCredReceive.interactionToken.signedCredentials[0].subject,
    ).to.eq(userIdentityWallet.did)

    expect(
      await validateDigestable(decodedCredReceive.interactionToken.signedCredentials[0], localDidMethod.resolver)
    ).to.eq(true)

  })
})
