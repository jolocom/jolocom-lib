import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { testPrivateIdentityKey } from '../data/keys'
import { DidDocument } from '../../ts/identity/didDocument'
import { claimsMetadata } from '../../ts/index'
import { singleClaimCreationArgs, singleClaimCredentialJSON } from '../data/credential/credential'
import { Credential } from '../../ts/credentials/credential/credential'
import { testSignedCred } from '../data/identityWallet'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { Identity } from '../../ts/identity/identity'
import { credentialRequestPayloadJson } from '../data/interactionFlows/jsonWebToken';
import { JSONWebToken } from '../../ts/interactionFlows/jsonWebToken';
import { CredentialRequestPayload } from '../../ts/interactionFlows/credentialRequest/credentialRequestPayload';
import { CredentialRequest } from '../../ts/interactionFlows/credentialRequest/credentialRequest';

chai.use(sinonChai)
const expect = chai.expect

describe('IdentityWallet', () => {
  const sandbox = sinon.createSandbox()
  let ddo
  let identity
  let identityWallet
  let clock

  before(async () => {
    clock = sinon.useFakeTimers()

    ddo = await new DidDocument().fromPrivateKey(testPrivateIdentityKey)
    identity = Identity.create({ didDocument: ddo.toJSON() })
    identityWallet = IdentityWallet.create({
      privateIdentityKey: testPrivateIdentityKey,
      identity
    })
  })

  after(() => {
    clock.restore()
  })

  describe('static create', () => {
    let create
    let iWallet: IdentityWallet
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

    it('should expose properties key and id on identityWallet.privateIdentityKey', () => {
      expect(Object.keys((iWallet as any).privateIdentityKey)).to.deep.equal([
        'key',
        'id'
      ])
    })
  })

  describe('create', () => {
    it('should expose credential, credentialRequest, signedCredential, signedCredentialRequest', () => {
      const mockProps = [
        'credential',
        'signedCredential',
        'credentialRequestJSONWebToken',
      ]

      expect(Object.keys(identityWallet.create)).to.deep.equal(mockProps)
    })

    it('create.credential should return a correct credential', () => {
      const credential = identityWallet.create.credential({
        metadata: claimsMetadata.emailAddress,
        claim: singleClaimCreationArgs
      })
      const credentialFromJSON = Credential.fromJSON(singleClaimCredentialJSON)

      expect(credential).to.deep.equal(credentialFromJSON)
    })

    it('create.credentialRequestJSONWebToken should return a correct credentialRequest JWT', () => {
      const credRequestJWT = identityWallet.create.credentialRequestJSONWebToken(credentialRequestPayloadJson)
      const credRequestPayload = credRequestJWT.getPayload()

      expect(credRequestJWT).to.be.an.instanceof(JSONWebToken)
      expect(credRequestPayload).to.be.an.instanceof(CredentialRequestPayload)
      expect(credRequestPayload.credentialRequest).to.be.an.instanceof(CredentialRequest)
    })

    it('create.signedCredential should return a correct signed credential', async () => {
      const credAttr = { metadata: claimsMetadata.emailAddress, claim: singleClaimCreationArgs }
      const signedCred = await identityWallet.create.signedCredential(credAttr)
      const mockSignedCred = SignedCredential.fromJSON(testSignedCred)

      expect(signedCred.getIssuer()).to.deep.equal(mockSignedCred.getIssuer())
      expect(signedCred.getCredentialSection()).to.deep.equal(mockSignedCred.getCredentialSection())
      expect(signedCred.getType()).to.deep.equal(mockSignedCred.getType())
    })

/*     it('create.signedCredentialRequest should return a correct signed credential request', () => {
      const credRequest = identityWallet.create.credentialRequest(credentialRequestCreationArgs)
      const signedCredRequest = identityWallet.create.signedCredentialRequest(credRequest)
      const mockSignedReq = SignedCredentialRequest.fromJSON(testSignedCredRequest)

      expect(signedCredRequest).to.deep.equal(mockSignedReq)
    }) */
  })

  describe('sign', () => {
    let signCredential
    let iWallet

    before(() => {
      signCredential = sandbox.spy(IdentityWallet.prototype, 'signCredential')
      iWallet = IdentityWallet.create({
        privateIdentityKey: testPrivateIdentityKey,
        identity
      })
    })

    after(() => {
      sandbox.restore()
    })

    it('sign.credential should call signCredential with correct params', () => {
      const credential = iWallet.create.credential({
        metadata: claimsMetadata.emailAddress,
        claim: singleClaimCreationArgs
      })
      iWallet.sign.credential(credential)

      sandbox.assert.calledOnce(signCredential)
      sandbox.assert.calledWith(signCredential, credential)
    })
  })

  describe('getter and setter for Identity', () => {
    it('getIdentity should return a correct instance of identity class ', () => {
      expect(identityWallet.getIdentity()).to.be.instanceof(Identity)
    })
  })

  describe('signCredential', () => {
    it('should return a correct signed credential', async () => {
      const credential = identityWallet.create.credential({
        metadata: claimsMetadata.emailAddress,
        claim: singleClaimCreationArgs
      })
      const signedCred = await identityWallet.signCredential(credential)
      const mockSignedCred = SignedCredential.fromJSON(testSignedCred)

      expect(signedCred.getIssuer()).to.deep.equal(mockSignedCred.getIssuer())
      expect(signedCred.getCredentialSection()).to.deep.equal(mockSignedCred.getCredentialSection())
      expect(signedCred.getType()).to.deep.equal(mockSignedCred.getType())
    })
  })

 /*  describe('signCredentialRequest', () => {
    it('should return a correct signCredentialRequest', () => {
      const credRequest = identityWallet.create.credentialRequest(credentialRequestCreationArgs)
      const signedCredRequest = identityWallet.signCredentialRequest(credRequest)
      const mockSignedReq = SignedCredentialRequest.fromJSON(testSignedCredRequest)

      expect(signedCredRequest).to.deep.equal(mockSignedReq)
    })
  }) */
})
