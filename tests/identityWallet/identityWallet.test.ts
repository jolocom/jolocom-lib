import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet';
import { testPrivateIdentityKey, testPublicIdentityKey } from '../data/keys'
import testIdentity from '../data/identity'
import { DidDocument } from '../../ts/identity/didDocument'
import { claimsMetadata } from '../../ts/index'
import { singleClaimCreationArgs, singleClaimCredentialJSON } from '../data/credential/credential'
import { Credential } from '../../ts/credentials/credential/credential'
import { credentialRequestCreationArgs } from '../data/credentialRequest/credentialRequest'
import { credentialAttr } from '../data/identityWallet'

chai.use(sinonChai)
const expect = chai.expect

describe('IdentityWallet', () => {
  const sandbox = sinon.createSandbox()
  const ddo = new DidDocument().fromPublicKey(testPublicIdentityKey)

  describe('static create', () => {
    let create
    let identityWallet
    before(() => {
      create = sandbox.spy(IdentityWallet, 'create')
      identityWallet = IdentityWallet.create({
        privateIdentityKey: testPrivateIdentityKey,
        identity: ddo
      })
    })

    after(() => {
      sandbox.restore()
    })

    // it('should be correctly called with correct arguments ', () => {
    //   sandbox.assert.calledOnce(create)
    //   sandbox.assert.calledWith(create, {
    //     privateIdentityKey: testIdentityPrivateKey,
    //     identity: testIdentity.ddoAttrs
    //   })
    // })

    it('should correctly return an instance of identityWallet', () => {
      expect(identityWallet).to.be.instanceof(IdentityWallet)
    })
  })

  describe('create', () => {
    const identityWallet = IdentityWallet.create({
      privateIdentityKey: testPrivateIdentityKey,
      identity: ddo
    })

    it('should expose credential, credentialRequest, signedCredential, signedCredentialRequest', () => {
      const mockProps = ['credential', 'credentialRequest', 'signedCredential', 'signedCredentialRequest']
      expect(Object.keys(identityWallet.create)).to.deep.equal(mockProps)
    })

    it('create.credential should return a correct credential', () => {
      const credential = identityWallet.create
        .credential({metadata: claimsMetadata.emailAddress, claim: singleClaimCreationArgs})
      const credentialFromJSON = Credential.fromJSON(singleClaimCredentialJSON)
      expect(credential).to.deep.equal(credentialFromJSON)
    })

    it('create.credentialRequest should return a correct credentialRequest', () => {
      const credRequest = identityWallet.create.credentialRequest(credentialRequestCreationArgs)
      expect(credRequest.getCallbackURL()).to.equal(credentialRequestCreationArgs.callbackURL)
      expect(credRequest.getRequestedCredentialTypes())
        .to.deep.equal([credentialRequestCreationArgs.credentialRequirements[0].type])
    })

    // it('create.signedCredential should retrun a correct signed credential', () => {
    //   const signedC = identityWallet.create
    //     .signedCredential({credentialAttr: singleClaimCreationArgs, privateIdentityKey: testPrivateIdentityKey})
    // })
  })
})
