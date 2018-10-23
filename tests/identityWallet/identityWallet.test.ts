import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { testPrivateIdentityKey } from '../data/keys'
import { DidDocument } from '../../ts/identity/didDocument'
import { claimsMetadata } from '../../ts/index'
import { singleClaimCreationArgs, singleClaimCredentialJSON } from '../data/credential/credential'
import { Credential } from '../../ts/credentials/credential/credential'
import { testSignedCred, testSubject } from '../data/identityWallet'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { Identity } from '../../ts/identity/identity'
import { CredentialRequestPayload } from '../../ts/interactionFlows/credentialRequest/credentialRequestPayload'
import { CredentialRequest } from '../../ts/interactionFlows/credentialRequest/credentialRequest'
import { credentialRequestPayloadJson } from '../data/interactionFlows/credentialRequest'
import { AuthenticationPayload } from '../../ts/interactionFlows/authentication/authenticationPayload'
import { Authentication } from '../../ts/interactionFlows/authentication/authentication'
import { jsonAuthPayload } from '../data/interactionFlows/authentication'
import { CredentialsReceivePayload } from '../../ts/interactionFlows/credentialsReceive/credentialsReceivePayload'
import { CredentialsReceive } from '../../ts/interactionFlows/credentialsReceive/credentialsReceive'
import { jsonCredReceivePayload } from '../data/interactionFlows/credentialReceive'
import { jsonCredentialOfferRequest } from '../data/interactionFlows/credentialOffer'
import {
  CredentialOfferRequestPayload
} from '../../ts/interactionFlows/credentialOfferRequest/credentialOfferRequestPayload'
import { CredentialOffer } from '../../ts/interactionFlows/credentialOfferRequest/credentialOffer'

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
    it('should expose credential, signedCredential & JWT options', () => {
      const mockProps = [
        'credential',
        'signedCredential',
        'credentialRequestJSONWebToken',
        'credentialResponseJSONWebToken',
        'authenticationJSONWebToken',
        'credentialsReceiveJSONWebToken',
        'credentialOfferRequestJSONWebToken',
        'credentialOfferResponseJSONWebToken'
      ]

      expect(Object.keys(identityWallet.create)).to.deep.equal(mockProps)
    })

    it('create.credential should return a correct credential', () => {
      const credential = identityWallet.create.credential({
        metadata: claimsMetadata.emailAddress,
        claim: singleClaimCreationArgs,
        subject: 'did:jolo:test'
      })
      const credentialFromJSON = Credential.fromJSON(singleClaimCredentialJSON)

      expect(credential).to.deep.equal(credentialFromJSON)
    })

    it('create.credentialRequestJSONWebToken should return a correct credentialRequest JWT', () => {
      const credRequestJWT = identityWallet.create.credentialRequestJSONWebToken(credentialRequestPayloadJson)
      const credRequestPayload = credRequestJWT.getPayload()

      expect(credRequestPayload).to.be.an.instanceof(CredentialRequestPayload)
      expect(credRequestPayload.credentialRequest).to.be.an.instanceof(CredentialRequest)
    })

    it('create.authenticationJSONWebToken should return a correct authentication JWT', () => {
      const authJWT = identityWallet.create.authenticationJSONWebToken(jsonAuthPayload)
      const authPayload = authJWT.getPayload()

      expect(authPayload).to.be.an.instanceof(AuthenticationPayload)
      expect(authPayload.authentication).to.be.an.instanceof(Authentication)
    })

    it('create.credentialReceiveJSONWebToken should return a correct credentialsReceive JWT', () => {
      const credReceiveJWT = identityWallet.create.credentialsReceiveJSONWebToken(jsonCredReceivePayload)
      const credReceivePayload = credReceiveJWT.getPayload()

      expect(credReceivePayload).to.be.an.instanceof(CredentialsReceivePayload)
      expect(credReceivePayload.credentialsReceive).to.be.an.instanceof(CredentialsReceive)
    })

    it('create.credentialOfferRequestJSONWebToken should return a correct credentialOfferRequest JWT', () => {
      const credOfferReqJWT = identityWallet.create.credentialOfferRequestJSONWebToken(jsonCredentialOfferRequest)
      const credOfferRequestPayload = credOfferReqJWT.getPayload()

      expect(credOfferRequestPayload).to.be.an.instanceof(CredentialOfferRequestPayload)
      expect(credOfferRequestPayload.credentialOffer).to.be.an.instanceof(CredentialOffer)
    })

    it('create.signedCredential should return a correct signed credential', async () => {
      const credAttr = { metadata: claimsMetadata.emailAddress, claim: singleClaimCreationArgs, subject: testSubject }
      const signedCred = await identityWallet.create.signedCredential(credAttr)
      const mockSignedCred = SignedCredential.fromJSON(testSignedCred)

      expect(signedCred.getIssuer()).to.deep.equal(mockSignedCred.getIssuer())
      expect(signedCred.getCredentialSection()).to.deep.equal(mockSignedCred.getCredentialSection())
      expect(signedCred.getType()).to.deep.equal(mockSignedCred.getType())
    })
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
        claim: singleClaimCreationArgs,
        subject: testSubject
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
        claim: singleClaimCreationArgs,
        subject: testSubject
      })
      const signedCred = await identityWallet.signCredential(credential)
      const mockSignedCred = SignedCredential.fromJSON(testSignedCred)

      expect(signedCred.getIssuer()).to.deep.equal(mockSignedCred.getIssuer())
      expect(signedCred.getCredentialSection()).to.deep.equal(mockSignedCred.getCredentialSection())
      expect(signedCred.getType()).to.deep.equal(mockSignedCred.getType())
    })
  })
})
