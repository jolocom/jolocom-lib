import { expect } from 'chai'
import { CredentialsReceive } from '../../ts/interactionFlows/credentialsReceive/credentialsReceive'
import { testSignedCredential } from '../data/credential/signedCredential'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { jsonCredReceive } from '../data/interactionFlows/credentialReceive'

describe('CredentialReceive', () => {
  const credentialsReceive = CredentialsReceive
    .create([SignedCredential.fromJSON(testSignedCredential)])

  it('Should create instace of CredentialReceive on static create', () => {  
    expect(credentialsReceive).to.be.instanceOf(CredentialsReceive)
  })

  it('should return an array of signed credential on getSignedCredentials', () => {
    const creds = credentialsReceive.getSignedCredentials()
    
    expect(creds).to.be.instanceOf(Array)
    expect(creds[0]).to.be.instanceOf(SignedCredential)
  })

  it('Should implement toJSON method', () => {
    expect(credentialsReceive.toJSON()).to.deep.equal(jsonCredReceive)
  })

  it('Should implement static fromJSON method', () => {
    const credReceive = CredentialsReceive.fromJSON(credentialsReceive.toJSON())
    
    expect(credReceive).to.be.instanceOf(CredentialsReceive)
    expect(credReceive.getSignedCredentials()[0]).to.be.instanceOf(SignedCredential)
  })
})
