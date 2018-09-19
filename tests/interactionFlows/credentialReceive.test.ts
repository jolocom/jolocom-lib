import { expect } from 'chai'
import { CredentialReceive } from '../../ts/interactionFlows/credentialReceive/credentialReceive'
import { testSignedCredential } from '../data/credential/signedCredential'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { jsonCredReceive } from '../data/interactionFlows/credentialReceive'

describe('CredentialReceive', () => {
  const credentialReceive = CredentialReceive
    .create([SignedCredential.fromJSON(testSignedCredential)])

  it('Should create instace of CredentialReceive on static create', () => {  
    expect(credentialReceive).to.be.instanceOf(CredentialReceive)
  })

  it('should return an array of signed credential on getSignedCredentials', () => {
    const creds = credentialReceive.getSignedCredentials()
    
    expect(creds).to.be.instanceOf(Array)
    expect(creds[0]).to.be.instanceOf(SignedCredential)
  })

  it('Should implement toJSON method', () => {
    expect(credentialReceive.toJSON()).to.deep.equal(jsonCredReceive)
  })

  it('Should implement static fromJSON method', () => {
    const credReceive = CredentialReceive.fromJSON(credentialReceive.toJSON())
    
    expect(credReceive).to.be.instanceOf(CredentialReceive)
    expect(credReceive.getSignedCredentials()[0]).to.be.instanceOf(SignedCredential)
  })
})
