import { expect } from 'chai'
import { SignedCredentialResponse } from '../../ts/credentialResponse/signedCredentialResponse/signedCredentialResponse'
import { CredentialResponse } from '../../ts/credentialResponse/credentialResponse'
import { firstMockCredential } from '../data/credentialRequest/credentialRequest'
import {
  mockPrivKey,
  mockSignedCredResponseJson,
  signedCredRespJWT
} from '../data/credentialResponse/signedCredentialResponse'
import { privateKeyToPublicKey } from '../../ts/utils/crypto'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'

chai.use(sinonChai)

describe('SignedCredentialResponse', () => {
  let clock
  const sandbox = sinon.createSandbox()

  const mockCredentialResponse = CredentialResponse.create([firstMockCredential])
  const mockSignedCredRespCreationArgs = {
    privateKey: Buffer.from(mockPrivKey, 'hex'),
    credentialResponse: mockCredentialResponse
  }

  before(() => {
    clock = sinon.useFakeTimers()
  })

  after(() => {
    sandbox.restore()
    clock.restore()
  })

  it('Should implement static create method', () => {
    const signedCredentialResponse = SignedCredentialResponse.create(mockSignedCredRespCreationArgs)
    expect(signedCredentialResponse.toJSON()).to.deep.equal(mockSignedCredResponseJson)
  })

  it('Should implement static create method with passed issuer', () => {
    const modifiedCreationArgs = Object.assign({}, mockSignedCredRespCreationArgs, { issuer: 'did:jolo:test' })
    const modifiedPayload = { ...mockSignedCredResponseJson.payload, iss: 'did:jolo:test' }
    const signedCredentialResponse = SignedCredentialResponse.create(modifiedCreationArgs)

    expect(signedCredentialResponse.toJSON()).to.deep.equal({
      ...mockSignedCredResponseJson,
      payload: modifiedPayload,
      signature: signedCredentialResponse.getSignature()
    })
  })

  it('Should implement static fromJWT method', () => {
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

  /* describe('verification with registry', () => {
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
  }) */

/*   it('Should implement satisfiesRequirements method', () => {
    const signedCredentialResponse = SignedCredentialResponse.create(mockSignedCredRespCreationArgs)
    // tslint:disable-next-line:no-unused-expression
    expect(signedCredentialResponse.satisfiesRequest).to.exist
  }) */
})
