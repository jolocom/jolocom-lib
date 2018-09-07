import { expect } from 'chai'
import { CredentialResponse } from '../../ts/credentialResponse/credentialResponse'
import { mockSuppliedCredentials } from '../data/credentialResponse/credentialResponse'
import {
  firstMockCredential,
} from '../data/credentialRequest/credentialRequest'

describe('CredentialResponse', () => {
  it('Should implement static create method', () => {
    const credentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse.getSuppliedCredentials()).to.deep.equal(mockSuppliedCredentials)
  })

  it('Should implement static fromJSON method', () => {
    const credentialResponse = CredentialResponse.fromJSON({suppliedCredentials: mockSuppliedCredentials})
    const expectedCredentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse).to.deep.equal(expectedCredentialResponse)
  })

  it('Should implement toJSON method', () => {
    const credentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse.toJSON()).to.deep.equal({suppliedCredentials: mockSuppliedCredentials})
  })

  it('Should implement all getter methods', () => {
    const credentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse.getSuppliedCredentials().length).to.equal(1)
    expect(credentialResponse.getSuppliedCredentials()).to.deep.equal(mockSuppliedCredentials)
  })

  /* it('Should implement a satisfiesRequest method', () => {
    const credentialRequest = CredentialRequest.create(credentialRequestCreationArgs)

    const validCredentialResponse = CredentialResponse.create([firstMockCredential])
    // tslint:disable-next-line:no-unused-expression
    expect(validCredentialResponse.satisfiesRequest(credentialRequest)).to.be.true

    const invalidCredentialResponse = CredentialResponse.create([secondMockCredential])
    // tslint:disable-next-line:no-unused-expression
    expect(invalidCredentialResponse.satisfiesRequest(credentialRequest)).to.be.false

    const mixedCredentialResponse = CredentialResponse.create([firstMockCredential, secondMockCredential])
    // tslint:disable-next-line:no-unused-expression
    expect(mixedCredentialResponse.satisfiesRequest(credentialRequest)).to.be.false
  }) */
})
