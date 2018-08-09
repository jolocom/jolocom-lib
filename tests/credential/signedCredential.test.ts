import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { testSignedCredentialCreateArgs } from '../data/credential/signedCredential';

chai.use(sinonChai)

describe('SignedCredential', () => {
  const sandbox = sinon.createSandbox()

  describe('static create method', () => {
    let create
    let generateSignature
    before(() => {
      create = sandbox.spy(SignedCredential, 'create')
      generateSignature = sandbox.spy(SignedCredential.prototype, 'generateSignature')
      SignedCredential.create(testSignedCredentialCreateArgs)
    })

    after(() => {
      sandbox.restore()
    })

    it('should be correctly called with correct arguments ', () => {
      sandbox.assert.calledOnce(create)
      sandbox.assert.calledWith(create, testSignedCredentialCreateArgs)
    })

    it('should call generateSignature with correct arguments', () => {
      sandbox.assert.calledOnce(generateSignature)
      sandbox.assert.calledWith(generateSignature, testSignedCredentialCreateArgs.privateIdentityKey)
    })
  })
})
