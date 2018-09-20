import { expect } from 'chai'
import { CredentialsReceivePayload } from '../../ts/interactionFlows/credentialsReceive/credentialsReceivePayload'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'  
import { CredentialsReceive } from '../../ts/interactionFlows/credentialsReceive/credentialsReceive'
import { testSignedCredential } from '../data/credential/signedCredential'
import { jsonCredReceivePayload } from '../data/interactionFlows/credentialReceive'

describe('CredentialReceivePayload', () => {
  const credentialsReceivePayload = CredentialsReceivePayload.create({
    typ: 'credentialsReceive',
    credentialsReceive: CredentialsReceive.create([SignedCredential.fromJSON(testSignedCredential)])
  }) 

  it('Should implement static create method and return correct instance', () => {
    expect(credentialsReceivePayload).to.be.instanceOf(CredentialsReceivePayload)
    expect(credentialsReceivePayload.getSignedCredentials()[0]).to.be.instanceOf(SignedCredential)
  })

  it('Should implement static fromJSON method & return correct instance CredentialReceive', () => {
    const credReceivePayloadRevived = CredentialsReceivePayload
      .fromJSON(credentialsReceivePayload.toJSON())
    
    expect(credReceivePayloadRevived).to.be.instanceOf(CredentialsReceivePayload)
    expect(credReceivePayloadRevived.credentialsReceive).to.be.instanceOf(CredentialsReceive)
    expect(credentialsReceivePayload.getSignedCredentials()[0]).to.be.instanceOf(SignedCredential)
  })

  it('Should implement toJSON method which returns a correct JSON', () => {
    expect(jsonCredReceivePayload).to.deep.equal(credentialsReceivePayload.toJSON())
  })
})
