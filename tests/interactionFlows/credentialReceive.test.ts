import { expect } from 'chai'
import { CredentialsReceive } from '../../ts/interactionFlows/credentialsReceive/credentialsReceive'
import { testSignedCredential } from '../data/credential/signedCredential'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { mockJsonCredReceive, jsonCredReceive } from '../data/interactionFlows/credentialReceive'

describe('CredentialsReceive', () => {
  const credentialsReceive = CredentialsReceive
    .create([SignedCredential.fromJSON(testSignedCredential)])

  it('Should create instace of CredentialsReceive on static create', () => {  
    expect(credentialsReceive).to.be.instanceOf(CredentialsReceive)
    expect(credentialsReceive).to.deep.equal(CredentialsReceive.fromJSON(jsonCredReceive))
  })

  it('should return an array of signed credential on getSignedCredentials', () => {
    const creds = credentialsReceive.getSignedCredentials()
    
    expect(creds).to.be.instanceOf(Array)
    expect(creds[0]).to.be.instanceOf(SignedCredential)
    expect(creds[0]).to.deep.equal(SignedCredential.fromJSON(testSignedCredential))
  })

  it('Should implement toJSON method', () => {
    expect(credentialsReceive.toJSON()).to.deep.equal(mockJsonCredReceive)
  })

  it('Should implement static fromJSON method', () => {
    const credReceive = CredentialsReceive.fromJSON(credentialsReceive.toJSON())
    
    expect(credReceive).to.be.instanceOf(CredentialsReceive)
    expect(credReceive.getSignedCredentials()[0]).to.be.instanceOf(SignedCredential)
    expect(credReceive).to.deep.equal(CredentialsReceive.fromJSON(jsonCredReceive))
  })
})
