import { expect } from 'chai'
import { mockPrivKey } from '../data/interactionFlows/credentialResponse'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { JSONWebToken } from '../../ts/interactionFlows/jsonWebToken'
import { jwtJSON, jwtCreateArgs, signedCredRequestJWT } from '../data/interactionFlows/jsonWebToken'
import { CredentialRequestPayload } from '../../ts/interactionFlows/credentialRequest/credentialRequestPayload'
import { privateKeyToPublicKey } from '../../ts/utils/crypto'
chai.use(sinonChai)

describe('JSONWebToken', () => {
  let clock
  const sandbox = sinon.createSandbox()

  before(() => {
    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
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
    clock = sinon.useFakeTimers()
    const decoded = JSONWebToken.decode(signedCredRequestJWT)

    it('Should return a valid InteractionType payload class', () => {
      expect(decoded).to.be.an.instanceof(CredentialRequestPayload)
    })
  })

  describe('validateSignatureWithPublicKey method', () => {
    clock = sinon.useFakeTimers()

    it('Should validate the signature using PublicKey', () => {
      const jsonWebToken = JSONWebToken.create(jwtCreateArgs)

      expect(
        jsonWebToken.validateSignatureWithPublicKey(privateKeyToPublicKey(Buffer.from(mockPrivKey, 'hex')))
      ).to.equal(true)
    })
  })
})
