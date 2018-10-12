import { expect } from 'chai'
import {
  credResponsePayloadJSON,
  credentialResponsePayloadCreationAttrs
} from './../data/interactionFlows/credentialResponse'
import { CredentialResponsePayload } from '../../ts/interactionFlows/credentialResponse/credentialResponsePayload'
import { CredentialResponse } from '../../ts/interactionFlows/credentialResponse/credentialResponse'
import { CredentialRequest } from '../../ts/interactionFlows/credentialRequest/credentialRequest'
import { credRequestCreationAttrs } from '../data/interactionFlows/credentialRequest'
import { testSignedCredentialDefault } from '../data/credential/signedCredential'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'

describe('CredentialResponsePayload', () => {
  const crp = CredentialResponsePayload.create(credentialResponsePayloadCreationAttrs)

  it('Should correctly return a credentialResponsePayload class on static create method', () => {
    expect(crp).to.be.instanceOf(CredentialResponsePayload)
    expect(crp.credentialResponse).to.be.instanceOf(CredentialResponse)
    expect(crp.credentialResponse.getSuppliedCredentials()[0]).to.be.instanceOf(SignedCredential)
    expect(crp.credentialResponse.getSuppliedCredentials()[0])
      .to.deep.equal(SignedCredential.fromJSON(testSignedCredentialDefault))
  })

  it('Should return true on credentialResponse.satisfiesRequest call', () => {
    const cr = CredentialRequest.create(credRequestCreationAttrs)
    // tslint:disable-next-line:no-unused-expression
    expect(crp.credentialResponse.satisfiesRequest(cr)).to.be.true
  })

  it('Should implement static fromJSON method which returns a valid instance of CredentialResponsePayload', () => {  
    const credResPayload = CredentialResponsePayload.fromJSON(credResponsePayloadJSON)
    crp.iss = credResponsePayloadJSON.iss
    crp.iat = credResponsePayloadJSON.iat
    expect(credResPayload).to.be.instanceOf(CredentialResponsePayload)
    expect(credResPayload.credentialResponse).to.be.instanceOf(CredentialResponse)
    expect(credResPayload.credentialResponse.getSuppliedCredentials()[0]).to.be.instanceOf(SignedCredential)
    expect(credResPayload.credentialResponse.suppliedCredentials)
      .to.deep.equal(crp.credentialResponse.suppliedCredentials)
    expect(credResPayload.credentialResponse.suppliedCredentials[0].getIssuer())
      .to.deep.equal(crp.credentialResponse.suppliedCredentials[0].getIssuer())
  })

  it('Should implement toJSON method which returns a correct JSON', () => {
    const json = crp.toJSON()
    // date issue
    expect(json.credentialResponse.suppliedCredentials[0].issuer)
      .to.deep.equal(credResponsePayloadJSON.credentialResponse.suppliedCredentials[0].issuer)
    expect(json.typ).to.deep.equal(credResponsePayloadJSON.typ)
  })

  it('Should expose CredentialResponse specific methods', () => {
    // tslint:disable-next-line:no-unused-expression
    expect(crp.getSuppliedCredentials).to.exist
  })
})
