import { expect } from 'chai'
import {
  // credentialResponseCreationArgs,
  // firstMockCredential,
  // secondMockCredential,
  // credentialRequestJson,
  // expectedRequestedCredentials
} from '../data/credentialRequest/credentialRequest'
// import { credentialRequestPayloadJson } from '../data/interactionFlows/'
import { CredentialRequestPayload } from '../../ts/interactionFlows/credentialRequest/credentialRequestPayload'

describe('CredentialResponsePayload', () => {
  it('Should implement static fromJSON method which returns a valid instance of CredentialResponsePayload', () => {
    // const crp = CredentialRequestPayload.fromJSON(credentialRequestPayloadJson)
    // expect(crp.getCallbackURL()).to.equal(credentialRequestPayloadJson.credentialRequest.callbackURL)
    // expect(crp.getRequestedCredentialTypes()).to.deep.equal([
    //   credentialRequestPayloadJson.credentialRequest.credentialRequirements[0].type
    // ])
  })

  it('Should implement toJSON method which returns a correct JSON', () => {
    // const crp = CredentialRequestPayload.fromJSON(credentialRequestPayloadJson)
    // const json = crp.toJSON()
    // expect(json).to.deep.equal(credentialRequestPayloadJson)
  })

  it('Should expose CredentialResponse specific methods', () => {
  //   const crp = CredentialRequestPayload.fromJSON(credentialRequestPayloadJson)

  //   expect(crp.applyConstraints).to.exist
  //   expect(crp.getCallbackURL).to.exist
  //   expect(crp.getRequestedCredentialTypes).to.exist
  // })
  })
})
