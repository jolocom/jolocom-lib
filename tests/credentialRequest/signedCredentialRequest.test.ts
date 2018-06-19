import * as lolex from 'lolex'
import { expect } from 'chai'
import { SignedCredentialRequest } from '../../ts/credentialRequest/signedCredentialRequest/signedCredentialRequest'
import { CredentialRequest } from '../../ts/credentialRequest/credentialRequest'
import { credentialRequestCreationArgs } from '../data/credentialRequest/credentialRequest'
import {
  signedCredReqJson,
  signedCredReqJWT,
  mockPrivKey,
  privKeyDID,
} from '../data/credentialRequest/signedCredentialRequest'

describe('SignedCredentialRequest', () => {
  let clock

  const mockCredentialRequest = CredentialRequest.create(credentialRequestCreationArgs)
  const signedCredReqCreationArgs = {
    privateKey: Buffer.from(mockPrivKey, 'hex'),
    credentialRequest: mockCredentialRequest
  }

  before(() => {
    clock = lolex.install()
  })

  after(() => {
    clock.uninstall()
  })

  // TODO with issuer
  it('Should implement static create method with no issuer provided', () => {
    const credentialRequest = CredentialRequest.create(credentialRequestCreationArgs)
    const signedCR = SignedCredentialRequest.create(signedCredReqCreationArgs)

    expect(signedCR.getIssuer()).to.equal(privKeyDID)
    expect(signedCR.getCallbackURL()).to.equal(credentialRequestCreationArgs.callbackURL)
    expect(signedCR.getCredentialRequest()).to.deep.equal(credentialRequest)
    expect(signedCR.getIssueTime()).to.equal(0)
    expect(signedCR.getRequestedCredentialTypes().length).to.equal(1)
    expect(signedCR.getRequestedCredentialTypes()).to.deep.equal([
      credentialRequestCreationArgs.requestedCredentials[0].type
    ])
  })

  it('Should implement static create method with issuer provided', () => {
    const credentialRequest = CredentialRequest.create(credentialRequestCreationArgs)
    const modifiedCreationArgs = Object.assign({}, signedCredReqCreationArgs, {
      issuer: 'did:jolo:mockIssuer'
    })

    const signedCR = SignedCredentialRequest.create(modifiedCreationArgs)

    expect(signedCR.getIssuer()).to.equal('did:jolo:mockIssuer')
    expect(signedCR.getCallbackURL()).to.equal(credentialRequestCreationArgs.callbackURL)
    expect(signedCR.getCredentialRequest()).to.deep.equal(credentialRequest)
    expect(signedCR.getIssueTime()).to.equal(0)
    expect(signedCR.getRequestedCredentialTypes().length).to.equal(1)
    expect(signedCR.getRequestedCredentialTypes()).to.deep.equal([
      credentialRequestCreationArgs.requestedCredentials[0].type
    ])
  })

  it('Should implement static fromJSON method', () => {
    const signedCR = SignedCredentialRequest.create(signedCredReqCreationArgs)
    const signedCRfromJSON = SignedCredentialRequest.fromJSON(signedCredReqJson)

    expect(signedCR).to.deep.equal(signedCRfromJSON)
  })

  it('Should implement toJSON method', () => {
    const signedCR = SignedCredentialRequest.create(signedCredReqCreationArgs)
    expect(signedCR.toJSON()).to.deep.equal(signedCredReqJson)
  })

  it('Should implement static fromJWT method', () => {
    const signedCRfromJWT = SignedCredentialRequest.fromJWT(signedCredReqJWT)

    const credentialRequest = CredentialRequest.create(credentialRequestCreationArgs)
    const args = {
      privateKey: Buffer.from(mockPrivKey, 'hex'),
      credentialRequest
    }

    const signedCR = SignedCredentialRequest.create(signedCredReqCreationArgs)
    expect(signedCRfromJWT).to.deep.equal(signedCR)
  })

  it('Should implement toJWT method', () => {
    const signedCR = SignedCredentialRequest.create(signedCredReqCreationArgs)
    expect(signedCR.toJWT()).to.deep.equal(signedCredReqJWT)
  })

  it('Should implement all getter methods', () => {
    const signedCR = SignedCredentialRequest.create(signedCredReqCreationArgs)

    expect(signedCR.getIssuer()).to.equal(privKeyDID)
    expect(signedCR.getIssueTime()).to.equal(0)
    expect(signedCR.getCredentialRequest()).to.deep.equal(mockCredentialRequest)
    expect(signedCR.getCallbackURL()).to.equal(credentialRequestCreationArgs.callbackURL)
    expect(signedCR.getRequestedCredentialTypes().length).to.equal(1)
    expect(signedCR.getRequestedCredentialTypes()).to.deep.equal([
      credentialRequestCreationArgs.requestedCredentials[0].type
    ])
  })

  // TODO
  it('Should implement a validateSignature method', () => {
    expect(false).to.equal(true)
  })

  it('Should implement an applyConstraints method', () => {
    const credentialRequest = CredentialRequest.create(credentialRequestCreationArgs)
    const args = {
      privateKey: Buffer.from(mockPrivKey, 'hex'),
      credentialRequest
    }
    const signedCR = SignedCredentialRequest.create(signedCredReqCreationArgs)
    // tslint:disable-next-line:no-unused-expression
    expect(signedCR.applyConstraints).to.exist
  })
})
