import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet';
import { testPrivateIdentityKey, testPublicIdentityKey, testPublicIdentityKey2 } from '../data/keys'
import { DidDocument } from '../../ts/identity/didDocument'
import { claimsMetadata } from '../../ts/index'
import { singleClaimCreationArgs, singleClaimCredentialJSON } from '../data/credential/credential'
import { Credential } from '../../ts/credentials/credential/credential'
import { credentialRequestCreationArgs } from '../data/credentialRequest/credentialRequest'
import { testSignedCred, testSignedCredRequest } from '../data/identityWallet'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { SignedCredentialRequest } from '../../ts/credentialRequest/signedCredentialRequest/signedCredentialRequest';
import { Identity } from '../../ts/identity/identity';

chai.use(sinonChai)
const expect = chai.expect

describe('IdentityWallet', () => {
  const sandbox = sinon.createSandbox()
  const ddo = new DidDocument().fromPublicKey(testPublicIdentityKey)
  const identity = Identity.create({didDocument: ddo.toJSON()})
  const identityWallet = IdentityWallet.create({
    privateIdentityKey: testPrivateIdentityKey,
    identity
  })

  let clock
  before(() => {
    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
  })

  describe('static create', () => {
    let create
    let iWallet
    before(() => {
      create = sandbox.spy(IdentityWallet, 'create')
      iWallet = IdentityWallet.create({ privateIdentityKey: testPrivateIdentityKey, identity })
    })

    after(() => {
      sandbox.restore()
    })

    it('should be correctly called with correct arguments ', () => {
      sandbox.assert.calledOnce(create)
      sandbox.assert.calledWith(create, { privateIdentityKey: testPrivateIdentityKey, identity })
    })

    it('should correctly return an instance of identityWallet', () => {
      expect(iWallet).to.be.instanceof(IdentityWallet)
    })
  })

  describe('create', () => {
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

    it('create.signedCredential should return a correct signed credential', async () => {
      const credAttr = { metadata: claimsMetadata.emailAddress, claim: singleClaimCreationArgs }
      const signedCred = await identityWallet.create.signedCredential(credAttr)
      const mockSignedCred = SignedCredential.fromJSON(testSignedCred)

      expect(signedCred.getIssuer()).to.deep.equal(mockSignedCred.getIssuer())
      expect(signedCred.getCredentialSection()).to.deep.equal(mockSignedCred.getCredentialSection())
      expect(signedCred.getType()).to.deep.equal(mockSignedCred.getType())
    })

    it('create.signedCredentialRequest should return a correct signed credential request', () => {
      const credRequest = identityWallet.create.credentialRequest(credentialRequestCreationArgs)
      const signedCredRequest = identityWallet.create.signedCredentialRequest(credRequest)
      const mockSignedReq = SignedCredentialRequest.fromJSON(testSignedCredRequest)

      expect(signedCredRequest).to.deep.equal(mockSignedReq)
    })
  })

  describe('sign', () => {
    let signCredential
    let signCredentialRequest
    let iWallet

    before(() => {
      signCredential = sandbox.spy(IdentityWallet.prototype, 'signCredential')
      signCredentialRequest = sandbox.spy(IdentityWallet.prototype, 'signCredentialRequest')
      iWallet = IdentityWallet.create({
        privateIdentityKey: testPrivateIdentityKey,
        identity
      })
    })

    after(() => {
      sandbox.restore()
    })

    it('sign.credential should call signCredential with correct params', () => {
      const credential = iWallet.create
        .credential({metadata: claimsMetadata.emailAddress, claim: singleClaimCreationArgs})
      iWallet.sign.credential(credential)

      sandbox.assert.calledOnce(signCredential)
      sandbox.assert.calledWith(signCredential, credential)
    })

    it('sign.credentialRequest should call signCredentialRequest with correct params', () => {
      const credRequest = iWallet.create.credentialRequest(credentialRequestCreationArgs)
      iWallet.sign.credentialRequest(credRequest)

      sandbox.assert.calledOnce(signCredentialRequest)
      sandbox.assert.calledWith(signCredentialRequest, credRequest)
    })
  })

  describe('getter and setter for Identity', () => {
    it('getIdentity should return a correct instance of identity class ', () => {
      expect(identityWallet.getIdentity()).to.be.instanceof(Identity)
    })

    it('setIdentity should correctly set identity on identityWallet', ()  => {
      const ddoTest = new DidDocument().fromPublicKey(testPublicIdentityKey2)
      const identityTest = Identity.create({didDocument: ddoTest.toJSON()})
      identityWallet.setIdentity(identityTest)

      expect(identityWallet.getIdentity()).to.deep.equal(identityTest)
    })
  })

  describe('signCredential', () => {
    it('should return a correct signed credential', async () => {
      const credential = identityWallet.create
        .credential({metadata: claimsMetadata.emailAddress, claim: singleClaimCreationArgs})
      const signedCred = await identityWallet.signCredential(credential)
      const mockSignedCred = SignedCredential.fromJSON(testSignedCred)

      expect(signedCred.getIssuer()).to.deep.equal(mockSignedCred.getIssuer())
      expect(signedCred.getCredentialSection()).to.deep.equal(mockSignedCred.getCredentialSection())
      expect(signedCred.getType()).to.deep.equal(mockSignedCred.getType())
    })
  })

  describe('signCredentialRequest', () => {
    it('should return a correct signCredentialRequest', () => {
      const credRequest = identityWallet.create.credentialRequest(credentialRequestCreationArgs)
      const signedCredRequest = identityWallet.signCredentialRequest(credRequest)
      const mockSignedReq = SignedCredentialRequest.fromJSON(testSignedCredRequest)

      expect(signedCredRequest).to.deep.equal(mockSignedReq)
    })
  })
})
