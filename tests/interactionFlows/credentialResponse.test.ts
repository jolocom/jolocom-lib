import { mockSuppliedCredential } from './../data/interactionFlows/credentialResponse'
import { expect } from 'chai'
import { credentialRequestCreationAttrs } from '../data/interactionFlows/credentialRequest'
import { CredentialResponse } from '../../ts/interactionFlows/credentialResponse/credentialResponse'
import { CredentialRequest } from '../../ts/interactionFlows/credentialRequest/credentialRequest'
import { firstMockCredential, secondMockCredential } from '../data/credential/signedCredential'

describe('CredentialResponse', () => {
  it('Should implement static create method', () => {
    const credentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse.getSuppliedCredentials()).to.deep.equal(mockSuppliedCredential)
  })

  it('Should implement static fromJSON method', () => {
    const credentialResponse = CredentialResponse.fromJSON({suppliedCredentials: mockSuppliedCredential})
    const expectedCredentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse).to.deep.equal(expectedCredentialResponse)
  })

  it('Should implement toJSON method', () => {
    const credentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse.toJSON()).to.deep.equal({suppliedCredentials: mockSuppliedCredential})
  })

  it('Should implement all getter methods', () => {
    const credentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse.getSuppliedCredentials().length).to.equal(1)
    expect(credentialResponse.getSuppliedCredentials()).to.deep.equal(mockSuppliedCredential)
  })

  it('Should implement a satisfiesRequest method', () => {
    const credentialRequest = CredentialRequest.create(credentialRequestCreationAttrs)

    const validCredentialResponse = CredentialResponse.create([firstMockCredential])
    // tslint:disable-next-line:no-unused-expression
    expect(validCredentialResponse.satisfiesRequest(credentialRequest)).to.be.true

    const invalidCredentialResponse = CredentialResponse.create([secondMockCredential])
    // tslint:disable-next-line:no-unused-expression
    expect(invalidCredentialResponse.satisfiesRequest(credentialRequest)).to.be.false

    const mixedCredentialResponse = CredentialResponse.create([firstMockCredential, secondMockCredential])
    // tslint:disable-next-line:no-unused-expression
    expect(mixedCredentialResponse.satisfiesRequest(credentialRequest)).to.be.false
  })
})
