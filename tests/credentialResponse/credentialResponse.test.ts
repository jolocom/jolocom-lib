import { expect } from 'chai'
import { CredentialResponse } from '../../ts/credentialResponse/credentialResponse'
import { firstMockCredential } from '../data/credentialRequest/credentialRequest'

const json = {
  suppliedCredentials: [{
    type: firstMockCredential.type,
    credential: firstMockCredential
  }]
}

describe('CredentialResponse', () => {
  it('Should implement static create method', () => {
    const credentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse.getSuppliedCredentials().length).to.equal(1)
    expect(credentialResponse.getSuppliedCredentials()[0]).to.deep.equal({
      type: firstMockCredential.type,
      credential: firstMockCredential
    })
  })

  it('Should implement static fromJSON method', () => {
    const credentialResponse = CredentialResponse.fromJSON(json)
    const expectedCredentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse).to.deep.equal(expectedCredentialResponse)
  })

  it('Should implement toJSON method', () => {
    const credentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse.toJSON()).to.deep.equal(json)
  })

  it('Should implement all getter methods', () => {
    const credentialResponse = CredentialResponse.create([firstMockCredential])
    expect(credentialResponse.getSuppliedCredentials().length).to.equal(1)
    expect(credentialResponse.getSuppliedCredentials()[0]).to.deep.equal({
      type: firstMockCredential.type,
      credential: firstMockCredential
    })
  })

  it('Should implement a satisfiesRequest method', () => {
    expect(true).to.equal(false)
  })
})
