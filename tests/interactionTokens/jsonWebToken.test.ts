import { expect } from 'chai'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { JSONWebToken } from '../../ts/interactionTokens/JSONWebToken'
import { CredentialRequest } from '../../ts/interactionTokens/credentialRequest'
import { simpleCredRequestJSON } from '../data/interactionTokens/credentialRequest.data'
import {
  signedSimpleCredReqJWT,
  encodedSimpleCredReqJWT,
  expiredEncodedSimpleCredReqJWT,
  hashedSimpleCredReqJWT,
} from '../data/interactionTokens/jsonWebToken.data'
import { InteractionType } from '../../ts/interactionTokens/types'
import { mockDid } from '../data/didDocument.data'
chai.use(sinonChai)

describe.only('JSONWebToken', () => {
  let clock
  let sandbox
  const credReq = CredentialRequest.fromJSON(simpleCredRequestJSON)

  /* Saves some typing later */

  const { iss, typ, iat, exp } = signedSimpleCredReqJWT.payload
  const { signature, payload } = signedSimpleCredReqJWT

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox = sinon.createSandbox()
  })

  after(() => {
    clock.restore()
    sandbox.restore()
  })

  /*
   * We don't need to test with all tokenizable objects, it's a simple setter for now
   * When we fromJWTEncodable, some data, such as issuer, typ and signature is not available, 
   */

  it('Should correctly implement fromJWTEncodable object', () => {
    const unsignedPayload = { ...payload, iat: 0 }
    delete unsignedPayload.typ
    delete unsignedPayload.iss
    delete unsignedPayload.exp
    delete unsignedPayload.iat

    const simplified = {
      ...signedSimpleCredReqJWT,
      payload: unsignedPayload,
    }

    delete simplified.signature

    const jwt = JSONWebToken.fromJWTEncodable(credReq)

    expect(jwt.toJSON()).to.deep.eq(simplified)
  })

  /* Tests getters as well */

  it('Should implement fromJSON', () => {
    const jwt = JSONWebToken.fromJSON(signedSimpleCredReqJWT)

    expect(jwt.getInteractionToken()).to.deep.eq(credReq)
    expect(jwt.getIssuer()).to.eq(iss)
    expect(jwt.getIssueTime()).to.eq(0)
    expect(jwt.getSignatureValue().toString('hex')).to.eq(signature)
  })

  it('Should implement all setters', () => {
    const jwt = new JSONWebToken()
    const nonce = Math.random().toString(36)
    
    jwt.setSignature(signature)
    jwt.setTokenContent(credReq)
    jwt.setTokenIssuer(iss)
    jwt.setIssueAndExpiryTime()
    jwt.setTokenNonce(nonce)
    jwt.setTokenAudience(mockDid)
    jwt.setTokenType(typ as InteractionType)

    expect(jwt.getSignatureValue().toString('hex')).to.eq(signature)
    expect(jwt.getIssuer()).to.eq(iss)
    expect(jwt.getInteractionToken()).to.deep.eq(credReq)
    expect(jwt.getIssueTime()).to.eq(iat)
    expect(jwt.getExpirationTime()).to.eq(exp)
    expect(jwt.getAudience()).to.eq(mockDid)
    expect(jwt.getTokenNonce()).to.eq(nonce)
  })

  it('Should implement static decode', () => {
    const referenceJWT = JSONWebToken.fromJSON(signedSimpleCredReqJWT)
    const decodedJWT = JSONWebToken.decode(encodedSimpleCredReqJWT)
    expect(decodedJWT).to.deep.eq(referenceJWT)
  })

  it('Should implement encode', () => {
    const jwt = JSONWebToken.fromJSON(signedSimpleCredReqJWT)
    expect(jwt.encode()).to.deep.eq(encodedSimpleCredReqJWT)
  })

  it('Should implement digest', async () => {
    const jwt = JSONWebToken.fromJSON(signedSimpleCredReqJWT)
    const digest = await jwt.digest()
    expect(digest.toString('hex')).to.eq(hashedSimpleCredReqJWT)
  })

  it('Should thow error on expired JWT during decode', () => {
    expect(() => JSONWebToken.decode(expiredEncodedSimpleCredReqJWT)).to.throw('Token expired')
  })
})
