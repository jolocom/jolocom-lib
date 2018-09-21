import { expect } from 'chai'
import { CredentialRequest } from '../../ts/interactionFlows/credentialRequest/credentialRequest'
import { firstMockCredential, secondMockCredential } from '../data/credential/signedCredential'
import {
  credentialRequestCreationAttrs,
  credentialRequestJson,
  expectedRequestedCredentials
} from '../data/interactionFlows/credentialRequest'

describe('CredentialRequest', () => {
  it('Should implement static create method', () => {
    const cr = CredentialRequest.create(credentialRequestCreationAttrs)
    expect(cr.getCallbackURL()).to.equal(credentialRequestCreationAttrs.callbackURL)
    expect(cr.getRequestedCredentialTypes()).to.deep.equal([
      credentialRequestCreationAttrs.credentialRequirements[0].type
    ])
  })

  it('Should implement an applyConstraints method', () => {
    const cr = CredentialRequest.create(credentialRequestCreationAttrs)
    const filtered = cr.applyConstraints([firstMockCredential, secondMockCredential])
    expect(filtered).to.deep.equal([firstMockCredential])
  })

  it('Should implement toJSON method', () => {
    const cr = CredentialRequest.create(credentialRequestCreationAttrs)
    expect(cr.toJSON()).to.deep.equal(credentialRequestJson)
  })

  it('Should implement all getter methods', () => {
    const credentialRequest = CredentialRequest.create(credentialRequestCreationAttrs)
    expect(credentialRequest.getCallbackURL()).to.equal(credentialRequestCreationAttrs.callbackURL)
    expect(credentialRequest.getRequestedCredentials()).to.deep.equal([expectedRequestedCredentials])
    expect(credentialRequest.getRequestedCredentialTypes().length).to.equal(1)
    expect(credentialRequest.getRequestedCredentialTypes()[0]).to.deep.equal(
      credentialRequestCreationAttrs.credentialRequirements[0].type
    )
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
    const expectedCredentialRequest = CredentialRequest.create(credentialRequestCreationAttrs)
    expect(credentialRequest).to.deep.equal(expectedCredentialRequest)
  })
})
