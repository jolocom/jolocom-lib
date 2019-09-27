import { expect } from 'chai'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { CredentialRequest } from '../../ts/interactionTokens/credentialRequest'
import { simpleCredRequestJSON } from '../data/interactionTokens/credentialRequest.data'
import {
  encodedValidCredReqJWT,
  validSignedCredReqJWT,
  hashedValidCredReqJWT,
} from '../data/interactionTokens/jsonWebToken.data'
import { InteractionType } from '../../ts/interactionTokens/types'
import { mockDid } from '../data/didDocument.data'
chai.use(sinonChai)

describe('JSONWebToken', () => {
  let clock
  let sandbox
  const credReq = CredentialRequest.fromJSON(simpleCredRequestJSON)

  /* Saves some typing later */

  const { iss, typ, iat, exp } = validSignedCredReqJWT.payload
  const { signature, payload } = validSignedCredReqJWT

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox = sinon.createSandbox()
  })

  after(() => {
    clock.restore()
    sandbox.restore()
  })

  /**
   * We don't need to test with all tokenizable objects, it's a simple setter for now
   * When we fromJWTEncodable, some data, such as issuer, typ and signature is not available,
   */

  it('Should correctly implement fromJWTEncodable object', () => {
    const unsignedPayload = { ...payload, iat: 0 }
    delete unsignedPayload.typ
    delete unsignedPayload.iss
    delete unsignedPayload.exp
    delete unsignedPayload.iat
    delete unsignedPayload.jti

    const simplified = {
      ...validSignedCredReqJWT,
      payload: unsignedPayload,
      signature: '',
    }

    const jwt = JSONWebToken.fromJWTEncodable(credReq)

    expect(jwt.toJSON()).to.deep.eq(simplified)
  })

  /* Tests getters as well */

  it('Should implement fromJSON', () => {
    const jwt = JSONWebToken.fromJSON(validSignedCredReqJWT)

    expect(jwt.interactionToken).to.deep.eq(credReq)
    expect(jwt.issuer).to.eq(iss)
    expect(jwt.issued).to.eq(0)
    expect(jwt.signature).to.eq(signature)
  })

  it('Should implement all setters', () => {
    const jwt = new JSONWebToken()
    const nonce = Math.random().toString(36)

    jwt.timestampAndSetExpiry()
    jwt.signature = signature
    jwt.interactionToken = credReq
    jwt.issuer = iss
    jwt.nonce = nonce
    jwt.audience = mockDid
    jwt.interactionType = typ as InteractionType

    expect(jwt.signature).to.eq(signature)
    expect(jwt.issuer).to.eq(iss)
    expect(jwt.interactionToken).to.deep.eq(credReq)
    expect(jwt.issued).to.eq(iat)
    expect(jwt.expires).to.eq(exp)
    expect(jwt.audience).to.eq(mockDid)
    expect(jwt.nonce).to.eq(nonce)
  })

  it('Should still support setIssueAndExpiryTime', () => {
    const jwt = new JSONWebToken()
    expect(() => jwt.setIssueAndExpiryTime()).to.not.throw()
    expect(jwt.expires).to.be.greaterThan(Date.now())
  })

  it('Should implement static decode', () => {
    const referenceJWT = JSONWebToken.fromJSON(validSignedCredReqJWT)
    const decodedJWT = JSONWebToken.decode(encodedValidCredReqJWT)
    expect(decodedJWT).to.deep.eq(referenceJWT)
  })

  it('Should implement encode', () => {
    const jwt = JSONWebToken.fromJSON(validSignedCredReqJWT)
    expect(jwt.encode()).to.deep.eq(encodedValidCredReqJWT)
  })

  it('Should implement digest', async () => {
    const jwt = JSONWebToken.fromJSON(validSignedCredReqJWT)
    const digest = await jwt.digest()
    expect(digest.toString('hex')).to.eq(hashedValidCredReqJWT)
  })
})
