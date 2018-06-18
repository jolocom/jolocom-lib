import { expect } from 'chai'
import { CredentialRequest } from '../../ts/credentialRequest/credentialRequest'
import {
  credentialRequestCreationArgs,
  firstMockCredential,
  secondMockCredential,
  credentialRequestJson
} from '../data/credentialRequest/credentialRequest'

describe('CredentialRequest', () => {
  it('Should implement static create method', () => {
    const cr = CredentialRequest.create(credentialRequestCreationArgs)
    expect(cr.getCallbackURL()).to.equal(credentialRequestCreationArgs.callbackURL)
    expect(cr.getRequestedCredentialTypes()).to.deep.equal([credentialRequestCreationArgs.requestedCredentials[0].type])
  })

  it('Should implement an applyConstraints method', () => {
    const cr = CredentialRequest.create(credentialRequestCreationArgs)
    const filtered = cr.applyConstraints([firstMockCredential, secondMockCredential])
    expect(filtered).to.deep.equal([firstMockCredential])
  })

  it('Should implement toJSON method', () => {
    const cr = CredentialRequest.create(credentialRequestCreationArgs)
    expect(cr.toJSON()).to.deep.equal(credentialRequestJson)
  })

  it('Should implement all getter methods', () => {
    const credentialRequest = CredentialRequest.create(credentialRequestCreationArgs)
    expect(credentialRequest.getCallbackURL()).to.equal(credentialRequestCreationArgs.callbackURL)
    expect(credentialRequest.getRequestedCredentialTypes().length).to.equal(1)
    expect(credentialRequest.getRequestedCredentialTypes()[0])
      .to.deep.equal(credentialRequestCreationArgs.requestedCredentials[0].type)
  })

  it('Should implement all setter methods', () => {
    const credentialRequest = new CredentialRequest()
    const mockCallbackURL = 'https://service.com/auth'

    // tslint:disable-next-line:no-unused-expression
    expect(credentialRequest.getCallbackURL()).to.be.undefined
    credentialRequest.setCallbackURL(mockCallbackURL)
    expect(credentialRequest.getCallbackURL()).to.equal(mockCallbackURL)
  })

  it('Should implement static fromJSON method', () => {
    const credentialRequest = CredentialRequest.fromJSON(credentialRequestJson)
    const expectedCredentialRequest = CredentialRequest.create(credentialRequestCreationArgs)
    expect(credentialRequest).to.deep.equal(expectedCredentialRequest)
  })
})
