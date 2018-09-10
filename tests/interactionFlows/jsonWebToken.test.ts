import { expect } from 'chai'
import { credentialRequestJson } from '../data/credentialRequest/credentialRequest'
import {
  mockPrivKey,
} from '../data/credentialResponse/signedCredentialResponse'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { JSONWebToken } from '../../ts/interactionFlows/JSONWebToken';
import { InteractionType } from '../../ts/interactionFlows/types';
import { CredentialRequest } from '../../ts/credentialRequest/credentialRequest';
import { jwtJSON, jwtCreateArgs, signedCredRequestJWT } from '../data/interactionFlows/jsonWebToken';
import {
   SignedCredentialRequestPayload
 } from '../../ts/interactionFlows/signedCredentialRequest/signedCredentialRequestPayload';
import { ddoAttr } from '../data/credentialRequest/signedCredentialRequest';
import { privateKeyToPublicKey } from '../../ts/utils/crypto';
import { Identity } from '../../ts/identity/identity';
import { JolocomRegistry } from '../../ts/registries/jolocomRegistry';
chai.use(sinonChai)

describe('JSONWebToken', () => {
  let clock
  const sandbox = sinon.createSandbox()
  const privateKey = Buffer.from(mockPrivKey, 'hex')

  const mockCredentialRequest = CredentialRequest.fromJSON(credentialRequestJson)

  before(() => {
    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
  })

  describe('Static create method', () => {
    clock = sinon.useFakeTimers()
    let jsonWebToken = JSONWebToken.create(jwtCreateArgs)

    it('Should return a correctly assembled instance of JSONWebToken class', () => {
      expect(jsonWebToken.getPayload()).to.be.an.instanceof(SignedCredentialRequestPayload)
      expect(jsonWebToken.toJSON()).to.deep.equal(jwtJSON)
      expect(jsonWebToken).to.be.an.instanceof(JSONWebToken)
    })

    it('The type of the payload should be the correct playload class that exposes class specific methods', () => {
      expect(jsonWebToken.getPayload()).to.be.an.instanceof(SignedCredentialRequestPayload)
      expect(jsonWebToken.getPayload().satisfiesConstraints).to.be.an.instanceof(Function)
    })

    it('Should generate the issuer from the private key when not passed', () => {
      const modifiedCreationArgs = jwtCreateArgs
      modifiedCreationArgs.payload.iss = undefined

      jsonWebToken = JSONWebToken.create(modifiedCreationArgs)

      expect(jsonWebToken.getIssuer()).to.equal(
        'did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb'
      )
    })

    it('Should throw an error in case the interaction type from the payload is not known', () => {
      jwtCreateArgs.payload.typ = 'NonExistingInteractionType'

      expect(() => JSONWebToken.create(jwtCreateArgs)).to.throw(
        'Interaction type not recognized!'
      )
      jwtCreateArgs.payload.typ = InteractionType.CredentialRequest
    })
  })

  describe('Static fromJSON method', () => {
    clock = sinon.useFakeTimers()
    const jsonWebToken = JSONWebToken.fromJSON(jwtJSON)

    it('Should return a correctly assembled instance of JSONWebToken class', () => {
      expect(jsonWebToken.getPayload()).to.be.an.instanceof(SignedCredentialRequestPayload)
      expect(jsonWebToken.toJSON()).to.deep.equal(jwtJSON)
      expect(jsonWebToken).to.be.an.instanceof(JSONWebToken)
    })

    it('The type of the payload should be the correct playload class', () => {
      expect(jsonWebToken.getPayload()).to.be.an.instanceof(SignedCredentialRequestPayload)
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
      expect(decoded).to.be.an.instanceof(SignedCredentialRequestPayload)
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
    let resolveStub

    beforeEach( () => {
      resolveStub = sandbox.stub(JolocomRegistry.prototype, 'resolve')
        .resolves(Identity.create({ didDocument: ddoAttr }))
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('Should validate the signature using JolocomRegistry by default', async () => {
      const jsonWebToken = JSONWebToken.create(jwtCreateArgs)

      expect(await jsonWebToken.validateSignatureWithRegistry()).to.equal(
        false
      )
    })
  })
})
