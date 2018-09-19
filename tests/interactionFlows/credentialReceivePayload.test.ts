import { expect } from 'chai'
import { CredentialReceivePayload } from '../../ts/interactionFlows/credentialReceive/credentialReceivePayload'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'  
import { CredentialReceive } from '../../ts/interactionFlows/credentialReceive/credentialReceive'
import { testSignedCredential } from '../data/credential/signedCredential'
import { jsonCredReceivePayload } from '../data/interactionFlows/credentialReceive'

describe('CredentialReceivePayload', () => {
  const credentialReceivePayload = CredentialReceivePayload.create({
    typ: 'credentialsReceive',
    credentialReceive: CredentialReceive.create([SignedCredential.fromJSON(testSignedCredential)])
  }) 

  it('Should implement static create method and return correct instance', () => {
    expect(credentialReceivePayload).to.be.instanceOf(CredentialReceivePayload)
    expect(credentialReceivePayload.getSignedCredentials()[0]).to.be.instanceOf(SignedCredential)
  })

  it('Should implement static fromJSON method & return correct instance CredentialReceive', () => {
    const credReceivePayloadRevived = CredentialReceivePayload
      .fromJSON(credentialReceivePayload.toJSON())
    
    expect(credReceivePayloadRevived).to.be.instanceOf(CredentialReceivePayload)
    expect(credReceivePayloadRevived.credentialReceive).to.be.instanceOf(CredentialReceive)
    expect(credentialReceivePayload.getSignedCredentials()[0]).to.be.instanceOf(SignedCredential)
  })

  it('Should implement toJSON method which returns a correct JSON', () => {
    expect(jsonCredReceivePayload).to.deep.equal(credentialReceivePayload.toJSON())
  })
})
