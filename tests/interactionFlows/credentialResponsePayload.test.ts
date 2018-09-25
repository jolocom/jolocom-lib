import { expect } from 'chai'
import { credentialResponsePayloadJson } from './../data/interactionFlows/credentialResponse'
import { CredentialResponsePayload } from '../../ts/interactionFlows/credentialResponse/credentialResponsePayload'
import { CredentialResponse } from '../../ts/interactionFlows/credentialResponse/credentialResponse'
import { CredentialRequest } from '../../ts/interactionFlows/CredentialRequest/credentialRequest'
import { credentialRequestCreationAttrs } from '../data/interactionFlows/credentialRequest'

describe('CredentialResponsePayload', () => {
  const crp = CredentialResponsePayload.fromJSON(credentialResponsePayloadJson)

  it('Should correctly return a credentialResponsePayload class on static create method', () => {
    const credResPayload = CredentialResponsePayload.create(credentialResponsePayloadJson)
    credResPayload.iss = credentialResponsePayloadJson.iss
    credResPayload.iat = credentialResponsePayloadJson.iat

    expect(credResPayload).to.deep.equal(crp)
    expect(credResPayload).to.be.instanceOf(CredentialResponsePayload)
    expect(credResPayload.credentialResponse).to.be.instanceOf(CredentialResponse)
    expect(credResPayload.getSuppliedCredentials()).to.deep.equal(crp.getSuppliedCredentials())
  })

  it('Should return true on credentialResponse.satisfiesRequest call', () => {
    const cr = CredentialRequest.create(credentialRequestCreationAttrs)
  
    expect(crp.credentialResponse.satisfiesRequest(cr)).to.be.true
  })

  it('Should implement static fromJSON method which returns a valid instance of CredentialResponsePayload', () => {  
    expect(crp.credentialResponse.getSuppliedCredentials())
      .to.deep.equal(credentialResponsePayloadJson.credentialResponse.suppliedCredentials)
  })

  it('Should implement toJSON method which returns a correct JSON', () => {
    const json = crp.toJSON()
    expect(json).to.deep.equal(credentialResponsePayloadJson)
  })

  it('Should expose CredentialResponse specific methods', () => {
    expect(crp.getSuppliedCredentials).to.exist
  })
})
