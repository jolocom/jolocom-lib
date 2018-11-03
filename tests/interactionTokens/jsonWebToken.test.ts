import { expect } from 'chai'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { JSONWebToken } from '../../ts/interactionFlows/JSONWebToken'
import { CredentialRequest } from '../../ts/interactionFlows/credentialRequest'
import { simpleCredRequestJSON } from '../data/interactionFlows/credentialRequest'
import { signedSimpleCredReqJWT, encodedSimpleCredReqJWT, hashedSimpleCredReqJWT } from '../data/interactionFlows/jsonWebToken'
import { InteractionType } from '../../ts/interactionFlows/types'
chai.use(sinonChai)

describe('JSONWebToken', () => {
  let clock
  let sandbox
  const credReq = CredentialRequest.fromJSON(simpleCredRequestJSON)

  /* Saves some typing later */

  const { iss, typ, iat } = signedSimpleCredReqJWT.payload
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

    const simplified = {
      ...signedSimpleCredReqJWT,
      payload: unsignedPayload
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

    jwt.setSignature(signature)
    jwt.setTokenContent(credReq)
    jwt.setTokenIssuer(iss)
    jwt.setTokenType(typ as InteractionType)

    expect(jwt.getSignatureValue().toString('hex')).to.eq(signature)
    expect(jwt.getIssuer()).to.eq(iss)
    expect(jwt.getInteractionToken()).to.deep.eq(credReq)
    expect(jwt.getIssueTime()).to.eq(iat)
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
})
