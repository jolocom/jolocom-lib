import { expect } from 'chai'
import { mockPrivKey } from '../data/credentialResponse/signedCredentialResponse'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { JSONWebToken } from '../../ts/interactionFlows/jsonWebToken'
import { InteractionType } from '../../ts/interactionFlows/types'
import { jwtJSON, jwtCreateArgs, signedCredRequestJWT, jwtCredentialReceiveArgs } from '../data/interactionFlows/jsonWebToken'
import { CredentialRequestPayload } from '../../ts/interactionFlows/credentialRequest/credentialRequestPayload'
import { CredentialReceivePayload } from '../../ts/interactionFlows/credentialReceive/credentialReceivePayload'
import { ddoAttr } from '../data/credentialRequest/signedCredentialRequest'
import { privateKeyToPublicKey } from '../../ts/utils/crypto'
import { Identity } from '../../ts/identity/identity'
import { JolocomRegistry } from '../../ts/registries/jolocomRegistry'
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
    const jwtCredentialReceive = JSONWebToken.create(jwtCredentialReceiveArgs)

    it('Should return a correctly assembled instance of JSONWebToken class', () => {
      expect(jsonWebToken.getPayload()).to.be.an.instanceof(CredentialRequestPayload)
      expect(jsonWebToken.toJSON()).to.deep.equal(jwtJSON)
      expect(jsonWebToken).to.be.an.instanceof(JSONWebToken)
    })

    // TODO: consolidate better when all flows are in
    it('Should return a correctly assembled instance of JSONWebToken class for credentialReceive', () => {
      expect(jwtCredentialReceive.getPayload()).to.be.an.instanceof(CredentialReceivePayload)
    })

    it('The type of the payload should be the correct playload class that exposes class specific methods', () => {
      expect(jsonWebToken.getPayload()).to.be.an.instanceof(CredentialRequestPayload)
      // expect(jsonWebToken.getPayload().applyConstraints).to.be.an.instanceof(Function)
    })

    it('Should throw an error in case the interaction type from the payload is not known', () => {
      jwtCreateArgs.payload.typ = 'NonExistingInteractionType'

      expect(() => JSONWebToken.create(jwtCreateArgs)).to.throw('Interaction type not recognized!')
      jwtCreateArgs.payload.typ = InteractionType.CredentialRequest
    })
  })

  describe('Static fromJSON method', () => {
    clock = sinon.useFakeTimers()
    const jsonWebToken = JSONWebToken.fromJSON(jwtJSON)

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

  describe('validateSignatureWithRegistry method', () => {
    clock = sinon.useFakeTimers()

    beforeEach(() => {
      sandbox.stub(JolocomRegistry.prototype, 'resolve').resolves(Identity.create({ didDocument: ddoAttr }))
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('Should validate the signature using JolocomRegistry by default', async () => {
      const jsonWebToken = JSONWebToken.create(jwtCreateArgs)

      expect(await jsonWebToken.validateSignatureWithRegistry()).to.equal(false)
    })
  })
})
