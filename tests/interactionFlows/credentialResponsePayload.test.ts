import { expect } from 'chai'
import { credentialResponsePayloadJson } from './../data/interactionFlows/credentialResponse';
import { CredentialResponsePayload } from '../../ts/interactionFlows/credentialResponse/credentialResponsePayload'

describe('CredentialResponsePayload', () => {
  it('Should implement static fromJSON method which returns a valid instance of CredentialResponsePayload', () => {
    const crp = CredentialResponsePayload.fromJSON(credentialResponsePayloadJson)
    expect(crp.credentialResponse.getSuppliedCredentials())
      .to.deep.equal(credentialResponsePayloadJson.credentialResponse.suppliedCredentials)
  })

  it('Should implement toJSON method which returns a correct JSON', () => {
    const crp = CredentialResponsePayload.fromJSON(credentialResponsePayloadJson)
    const json = crp.toJSON()
    expect(json).to.deep.equal(credentialResponsePayloadJson)
  })

  it('Should expose CredentialResponse specific methods', () => {
    const crp = CredentialResponsePayload.fromJSON(credentialResponsePayloadJson)
    expect(crp.getSuppliedCredentials).to.exist
  })
})
