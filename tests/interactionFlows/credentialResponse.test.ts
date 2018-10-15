import { credentialResponseJSON } from './../data/interactionFlows/credentialResponse'
import { expect } from 'chai'
import { credRequestCreationAttrs } from '../data/interactionFlows/credentialRequest'
import { CredentialResponse } from '../../ts/interactionFlows/credentialResponse/credentialResponse'
import { CredentialRequest } from '../../ts/interactionFlows/credentialRequest/credentialRequest'
import { testSignedCredentialDefault, secondMockCredential } from '../data/credential/signedCredential'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'

describe('CredentialResponse', () => {
  const credentialResponse = CredentialResponse.create([testSignedCredentialDefault])

  it('Should implement static create method', () => {
    expect(credentialResponse).to.be.instanceOf(CredentialResponse)
    expect(credentialResponse.getSuppliedCredentials()[0])
      .to.be.instanceOf(SignedCredential)
    expect(credentialResponse.getSuppliedCredentials())
      .to.deep.equal([SignedCredential.fromJSON(testSignedCredentialDefault)])
  })

  it('Should implement static fromJSON method', () => {
    const credResponse = CredentialResponse.fromJSON(credentialResponseJSON)
    const expectedCredentialResponse = CredentialResponse.create([testSignedCredentialDefault])

    expect(credResponse).to.be.instanceOf(CredentialResponse)
    expect(credResponse.getSuppliedCredentials()[0]).to.be.instanceOf(SignedCredential)
    expect(credResponse).to.deep.equal(expectedCredentialResponse)
  })

  it('Should implement toJSON method', () => {
    const json = credentialResponse.toJSON()

    // date issue
    expect(json.suppliedCredentials[0].issuer)
      .to.deep.equal(credentialResponseJSON.suppliedCredentials[0].issuer)
  })

  it('Should implement all getter methods', () => {
    // tslint:disable-next-line:no-unused-expression
    expect(credentialResponse.getSuppliedCredentials).to.exist
    expect(credentialResponse.getSuppliedCredentials().length).to.equal(1)
  })

  it('Should correctly implement the satisfiesRequest method', () => {
    const credentialRequest = CredentialRequest.create(credRequestCreationAttrs)
    const invalidCredentialResponse = CredentialResponse.create([secondMockCredential])
    const mixedCredentialResponse = CredentialResponse
      .create([testSignedCredentialDefault, secondMockCredential])

    expect(credentialResponse.satisfiesRequest(credentialRequest)).to.be.true
    expect(invalidCredentialResponse.satisfiesRequest(credentialRequest)).to.be.false
    expect(mixedCredentialResponse.satisfiesRequest(credentialRequest)).to.be.false
  })
})
