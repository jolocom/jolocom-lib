import { expect } from 'chai'
import { credentialRequestJson } from '../data/credentialRequest/credentialRequest'
import {
  mockPrivKey,
  mockSignedCredResponseJson,
} from '../data/credentialResponse/signedCredentialResponse'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { JSONWebToken } from '../../ts/interactionFlows/jsonWebToken';
import { IJSONWebTokenCreationAttrs, InteractionType } from '../../ts/interactionFlows/types';
import { CredentialRequest } from '../../ts/credentialRequest/credentialRequest';
import { jwtJSON, jwtCreateArgs } from '../data/interactionFlows/jsonWebToken';
import {
   SignedCredentialRequestPayload
 } from '../../ts/interactionFlows/signedCredentialRequest/signedCredentialRequestPayload';
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

  /* it('Should implement static fromJWT method', () => {
    const signedCredentialResponseFromJWT = SignedCredentialResponse.fromJWT(signedCredRespJWT)
    const signedCredentialResponse = SignedCredentialResponse.create(mockSignedCredRespCreationArgs)
    expect(signedCredentialResponseFromJWT).to.deep.equal(signedCredentialResponse)
  })

  it('Should implement toJWT method', () => {
    const signedCredentialResponse = SignedCredentialResponse.create(mockSignedCredRespCreationArgs)
    expect(signedCredentialResponse.toJWT()).to.equal(signedCredRespJWT)
  })

  it('Should implement static fromJSON method', () => {
    const signedCredRespFromJson = SignedCredentialResponse.fromJSON(mockSignedCredResponseJson)
    const signedCredResponse = SignedCredentialResponse.create(mockSignedCredRespCreationArgs)
    expect(signedCredRespFromJson).to.deep.equal(signedCredResponse)
  })

  it('Should implement toJSON method', () => {
    const signedCredentialResponse = SignedCredentialResponse.create(mockSignedCredRespCreationArgs)
    expect(signedCredentialResponse.toJSON()).to.deep.equal(mockSignedCredResponseJson)
  })

  it('Should implement validateSignatureWithPublicKey method', () => {
    const signedCredentialResponse = SignedCredentialResponse.create(mockSignedCredRespCreationArgs)
    expect(
      signedCredentialResponse.validateSignatureWithPublicKey(privateKeyToPublicKey(Buffer.from(mockPrivKey, 'hex')))
    ).to.equal(true)
  })

  describe('verification with registry', () => {
    let resolveStub
    const mockCredentialResponse = CredentialResponse.create([firstMockCredential])
    const mockSignedCredRespCreationArgs = {
      privateKey: Buffer.from(mockPrivKey, 'hex'),
      credentialResponse: mockCredentialResponse
  }

    beforeEach( () => {
      resolveStub = sandbox.stub(JolocomRegistry.prototype, 'resolve')
        .resolves(Identity.create({ didDocument: ddoAttr }))
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('Should implement a validateSignature method that defaults to using JolocomRegistry', async() => {
      const incorrectlySignedCR = SignedCredentialResponse.create(mockSignedCredRespCreationArgs)

      expect(await incorrectlySignedCR.validateSignature()).to.equal(
        false
      )
    })
  })

  it('Should implement satisfiesRequirements method', () => {
    const signedCredentialResponse = SignedCredentialResponse.create(mockSignedCredRespCreationArgs)
    // tslint:disable-next-line:no-unused-expression
    expect(signedCredentialResponse.satisfiesRequest).to.exist
  }) */
})
