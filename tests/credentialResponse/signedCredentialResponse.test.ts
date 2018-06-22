import { expect } from 'chai'
import * as lolex from 'lolex'
import { SignedCredentialResponse } from '../../ts/credentialResponse/signedCredentialResponse/signedCredentialResponse'
import { CredentialResponse } from '../../ts/credentialResponse/credentialResponse'
import { firstMockCredential } from '../data/credentialRequest/credentialRequest'
import {
  mockPrivKey,
  mockSignedCredResponseJson,
  signedCredRespJWT
} from '../data/credentialResponse/signedCredentialResponse'

describe('SignedCredentialResponse', () => {
  let clock

  const mockCredentialResponse = CredentialResponse.create([firstMockCredential])
  const mockSignedCredRespCreationArgs = {
    privateKey: Buffer.from(mockPrivKey, 'hex'),
    credentialResponse: mockCredentialResponse
  }

  before(() => {
    clock = lolex.install()
  })

  after(() => {
    clock.uninstall()
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

  it('Should implement validateSignature method', () => {
    expect(false).to.equal(true)
  })

  it('Should implement satisfiesRequirements method', () => {
    const signedCredentialResponse = SignedCredentialResponse.create(mockSignedCredRespCreationArgs)
    // tslint:disable-next-line:no-unused-expression
    expect(signedCredentialResponse.satisfiesRequest).to.exist
  })
})
