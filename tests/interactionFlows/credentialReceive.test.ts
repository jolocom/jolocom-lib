import { expect } from 'chai'
import { CredentialReceive } from '../../ts/interactionFlows/credentialReceive/credentialReceive'
import {
  testSignedCredentialCreateArgs
} from '../data/credential/signedCredential'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential';
import * as sinon from 'sinon'

describe('CredentialReceive', () => {
  let credReceive
  let sandbox
  
  before(async () => {
    sandbox = sinon.createSandbox()
    const signedCred = await SignedCredential.create(testSignedCredentialCreateArgs)
    credReceive = CredentialReceive.create([signedCred])
    const validateSigStub = sandbox.stub(SignedCredential.prototype, 'validateSignature').resolves(true)
  })

  after(() => {
    sandbox.restore()
  })

  it('Should create instace of CredentialReceive on static create', async () => {  
    expect(credReceive).to.be.instanceOf(CredentialReceive)
  })

  it('Should return true on validateCredentials with correct inputs', async () => {
    const res = await credReceive.validateCredentials('did:jolo:test')
    expect(res).to.be.true
  })

  it('Should return false on validateCredentials with deviating subject did', async () => {
    const res = await credReceive.validateCredentials('did:helloworld:test')  
    expect(res).to.be.false
  })

  it('should return an array of signed credential on getSignedCredentials', () => {
    const creds = credReceive.getSignedCredentials()
    expect(creds).to.be.instanceOf(Array)
    expect(creds[0]).to.be.instanceOf(SignedCredential)
  })
})
