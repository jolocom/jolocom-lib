import * as sinon from 'sinon'
import { credentialResponseJSON } from './../data/interactionTokens/credentialResponse.data'
import { expect } from 'chai'
import { CredentialResponse } from '../../ts/interactionTokens/credentialResponse'
import { credentialSet, simpleCredRequestJSON } from '../data/interactionTokens/credentialRequest.data'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { CredentialRequest } from '../../ts/interactionTokens/credentialRequest'

describe('CredentialResponse', () => {
  let credRes: CredentialResponse

  it('Should implement static fromJSON', () => {
    credRes = CredentialResponse.fromJSON(credentialResponseJSON)
    expect(credRes.toJSON()).to.deep.eq(credentialResponseJSON)
  })

  it('Should implement getters method', () => {
    expect(credRes.getCallbackURL()).to.eq(credentialResponseJSON.callbackURL)
    expect(credRes.getSuppliedCredentials()).to.deep.eq(credentialSet.map(SignedCredential.fromJSON))
  })

  it('Should correctly call the satisfiesRequest method on credential request', () => {
    const credentialRequest = CredentialRequest.fromJSON(simpleCredRequestJSON)
    const stub = sinon.stub(credentialRequest, 'applyConstraints').returns(credentialSet)

    expect(credRes.satisfiesRequest(credentialRequest)).to.be.true
    expect(stub.getCall(0).args[0]).to.deep.eq(credentialSet)
  })
})
