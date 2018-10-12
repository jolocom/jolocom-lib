import { expect } from 'chai'
import {
  credentialRequestPayloadJson,
  credentialRequestPayloadCreateAttrs
} from '../data/interactionFlows/credentialRequest'
import { CredentialRequestPayload } from '../../ts/interactionFlows/credentialRequest/credentialRequestPayload'
import { CredentialRequest } from '../../ts/interactionFlows/credentialRequest/credentialRequest'

describe('CredentialRequestPayload', () => {
  const crp = CredentialRequestPayload.fromJSON(credentialRequestPayloadJson)

  it('Should correctly return a credentialRequestPayload class on static create method', () => {
    const credReqPayload = CredentialRequestPayload.create(credentialRequestPayloadCreateAttrs)
    credReqPayload.iss = credentialRequestPayloadJson.iss
    credReqPayload.iat = credentialRequestPayloadJson.iat

    expect(credReqPayload).to.deep.equal(crp)
    expect(credReqPayload).to.be.instanceOf(CredentialRequestPayload)
    expect(credReqPayload.credentialRequest).to.be.instanceOf(CredentialRequest)
    expect(crp.getCallbackURL()).to.deep.equal(credReqPayload.getCallbackURL())
    expect(crp.getRequestedCredentialTypes())
      .to.deep.equal(credReqPayload.getRequestedCredentialTypes())
  })

  it('Should implement static fromJSON method which returns a valid instance of CredentialRequestPayload', () => {
    expect(crp.getCallbackURL()).to.equal(credentialRequestPayloadJson.credentialRequest.callbackURL)
    expect(crp.getRequestedCredentialTypes()).to.deep.equal([
      credentialRequestPayloadJson.credentialRequest.credentialRequirements[0].type
    ])
  })

  it('Should implement toJSON method which returns a correct JSON', () => {
    const json = crp.toJSON()
    expect(json).to.deep.equal(credentialRequestPayloadJson)
  })

  it('Should expose CredentialRequest specific methods', () => {
    // tslint:disable:no-unused-expression
    expect(crp.applyConstraints).to.exist
    expect(crp.getCallbackURL).to.exist
    expect(crp.getRequestedCredentialTypes).to.exist
    // tslint:enable
  })
})
