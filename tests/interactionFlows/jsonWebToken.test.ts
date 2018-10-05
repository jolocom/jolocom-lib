import { expect } from 'chai'
import { mockPrivKey } from '../data/interactionFlows/credentialResponse'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { JSONWebToken } from '../../ts/interactionFlows/JSONWebToken'
import {
  jwtJSON,
  jwtCreateArgs,
  signedCredRequestJWT,
  signedCredRequestJWTIncorrect
} from '../data/interactionFlows/jsonWebToken'
import { CredentialRequestPayload } from '../../ts/interactionFlows/credentialRequest/credentialRequestPayload'
import { JolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { DidDocument } from '../../ts/identity/didDocument'
chai.use(sinonChai)

describe('JSONWebToken', () => {
  let clock
  let sandbox

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox = sinon.createSandbox()
  })

  after(() => {
    clock.restore()
    sandbox.restore()
  })

  describe('Static create method', () => {
    clock = sinon.useFakeTimers()
    const jsonWebToken = JSONWebToken.create(jwtCreateArgs)

    it('Should return a correctly assembled instance of JSONWebToken class', () => {
      expect(jsonWebToken.getPayload()).to.be.an.instanceof(CredentialRequestPayload)
      expect(jsonWebToken.toJSON().payload).to.deep.equal(jwtJSON.payload)
      expect(jsonWebToken).to.be.an.instanceof(JSONWebToken)
    })

    it('The type of the payload should be the correct payload class that exposes class specific methods', () => {
      expect(jsonWebToken.getPayload()).to.be.an.instanceof(CredentialRequestPayload)
      expect(jsonWebToken.getPayload().applyConstraints).to.be.an.instanceof(Function)
    })
  })

  describe('Static fromJSON method', () => {
    clock = sinon.useFakeTimers()
    const jsonWebToken = JSONWebToken.create(jwtCreateArgs)

    it('Should return a correctly assembled instance of JSONWebToken class', () => {
      expect(jsonWebToken.getPayload()).to.be.an.instanceof(CredentialRequestPayload)
      expect(jsonWebToken.toJSON()).to.deep.equal(jwtJSON)
      expect(jsonWebToken).to.be.an.instanceof(JSONWebToken)
    })

    it('The type of the payload should be the correct playload class', () => {
      expect(jsonWebToken.getPayload()).to.be.an.instanceof(CredentialRequestPayload)
    })
  })

  describe('toJSON method', () => {
    clock = sinon.useFakeTimers()
    const jsonWebToken = JSONWebToken.create(jwtCreateArgs)
    const json = jsonWebToken.toJSON()

    it('Should return a correctly structured JSON object', () => {
      expect(json).to.deep.equal(jwtJSON)
    })
  })

  describe('encode method', () => {
    clock = sinon.useFakeTimers()
    const jsonWebToken = JSONWebToken.create(jwtCreateArgs)
    const encodedJWT = jsonWebToken.encode()

    it('Should return a JWT', () => {
      expect(encodedJWT).to.deep.equal(signedCredRequestJWT)
    })
  })

  describe('decode method', () => {
    before( async () => {
      const ddo = await new DidDocument().fromPrivateKey(Buffer.from(mockPrivKey, 'hex'))
      sandbox.stub(JolocomRegistry.prototype, 'resolve')
        .resolves(ddo)
    })
    
    it('Should return a valid InteractionType payload class and pass signature validation', async () => {
      const decoded = await JSONWebToken.decode(signedCredRequestJWT)
      
      expect(decoded).to.be.an.instanceof(CredentialRequestPayload)
    })

    it('validateSignatureWithPublicKey should return true with valid inputs', async () => {
      const jsonWebToken = JSONWebToken.create(jwtCreateArgs)
      const token = jsonWebToken.encode()
      const valid = await JSONWebToken.validateSignatureWithPublicKey({
        keyId: jsonWebToken.getPayload().iss,
        jwt: token
      })

      expect(valid).to.be.true
    })

    it('validateSignatureWithPublicKey should return false with invalid JWT signature', async () => {
      const jsonWebToken = JSONWebToken.create(jwtCreateArgs)
      const valid = await JSONWebToken.validateSignatureWithPublicKey({
        keyId: jsonWebToken.getPayload().iss,
        jwt: signedCredRequestJWTIncorrect
      })

      expect(valid).to.be.false
    })
  })
})
