import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { DidDocument } from '../../ts/identity/didDocument'
import { Credential } from '../../ts/credentials/credential/credential'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { Identity } from '../../ts/identity/identity'
import { didDocumentJSON, mockKeyId } from '../data/didDocument'
import { IVaultedKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { KeyTypes } from '../../ts/vaultedKeyProvider/types'
import { mockNameCredCreationAttrs } from '../data/credential/credential'
import { jsonAuthentication } from '../data/interactionFlows/authentication';
import { Authentication } from '../../ts/interactionFlows/authentication';

chai.use(sinonChai)
const expect = chai.expect

describe('IdentityWallet', () => {
  const encryptionPass = 'secret'
  const didDocument = DidDocument.fromJSON(didDocumentJSON)
  const identity = Identity.fromDidDocument({ didDocument })

  const vaultedKeyProvider = {
    signDigestable: sinon.stub().callsFake(attrs => {
      expect(attrs).to.deep.eq({ encryptionPass, derivationPath: KeyTypes.jolocomIdentityKey })
      return Buffer.from(
        'ed3fac7fcc3d83623e368dc90ac377e14441a400019d57f9479b833f1211acbb0dffb4cf189ed1335dad1f1e0f0a99f0527b6befab44c55f7323116b9f60bfb1',
        'hex'
      )
    })
  } as IVaultedKeyProvider

  const iw: IdentityWallet = new IdentityWallet({
    identity,
    vaultedKeyProvider,
    publicKeyMetadata: {
      derivationPath: KeyTypes.jolocomIdentityKey,
      keyId: mockKeyId
    }
  })

  describe('constructor', () => {
    it('Should correctly initialize', () => {})
    it('Should throw if arguments are missing', () => {})
  })

  describe('create', () => {
    let stubSignedCredential

    before(() => {
      stubSignedCredential = sinon.stub(SignedCredential, 'create').callsFake(attrs => {
        expect(attrs).to.deep.eq(mockNameCredCreationAttrs)
        return {
          digest: async () => Buffer.from('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
          setSignatureValue: value => {
            expect(value).to.eq(
              'ed3fac7fcc3d83623e368dc90ac377e14441a400019d57f9479b833f1211acbb0dffb4cf189ed1335dad1f1e0f0a99f0527b6befab44c55f7323116b9f60bfb1'
            )
          }
        }
      })

      // stubAuth = sinon.stub(Authentication, '')
    })

    after(() => {
      stubSignedCredential.restore()
    })

    it('Should expose aggregated creation methods', () => {
      const categories = ['credential', 'signedCredential', 'interactionTokens']
      const flowTypes = ['request', 'response']
      const tokenTypes = ['auth', 'offer', 'share']

      expect(Object.keys(iw.create)).to.deep.eq(categories)
      expect(Object.keys(iw.create.interactionTokens)).to.deep.eq(flowTypes)
      expect(Object.keys(iw.create.interactionTokens.request)).to.deep.eq(tokenTypes)
      expect(Object.keys(iw.create.interactionTokens.response)).to.deep.eq(tokenTypes)
    })

    it('Should attempt to create credential', () => {
      expect(iw.create.credential).to.eq(Credential.create)
    })

    it('Should attempt to create signedCredential', async () => {
      await iw.create.signedCredential(mockNameCredCreationAttrs, encryptionPass)
    })

    describe('authenticationRequest', async() => {
      console.log(await iw.create.interactionTokens.request.auth(jsonAuthentication, encryptionPass))
    })
    describe('authenticationResponse', () => {})

    describe('credentialRequest', () => {})
    describe('credentialResponse', () => {})

    describe('credentialOfferRequest', () => {})
    describe('credentialOfferResponse', () => {})

    describe('credentialReceive', () => {})
  })
  // let create
  // let iWallet: IdentityWallet
  // before(() => {
  //   create = sandbox.spy(IdentityWallet, 'create')
  //   iWallet = IdentityWallet.create({ privateIdentityKey: testPrivateIdentityKey, identity })
  // })

  // after(() => {
  //   sandbox.restore()
  // })

  //   it('should be correctly called with correct arguments ', () => {
  //     sandbox.assert.calledOnce(create)
  //     sandbox.assert.calledWith(create, { privateIdentityKey: testPrivateIdentityKey, identity })
  //   })

  //   it('should correctly return an instance of identityWallet', () => {
  //     expect(iWallet).to.be.instanceof(IdentityWallet)
  //   })

  //   it('should expose properties key and id on identityWallet.privateIdentityKey', () => {
  //     expect(Object.keys((iWallet as any).privateIdentityKey)).to.deep.equal([
  //       'key',
  //       'id'
  //     ])
  //   })
  // })

  // describe('create', () => {
  //   it('should expose credential, signedCredential & JWT options', () => {
  //     const mockProps = [
  //       'credential',
  //       'signedCredential',
  //       'credentialRequestJSONWebToken',
  //       'credentialResponseJSONWebToken',
  //       'authenticationJSONWebToken',
  //       'credentialsReceiveJSONWebToken',
  //       'credentialOfferRequestJSONWebToken',
  //       'credentialOfferResponseJSONWebToken'
  //     ]

  //     expect(Object.keys(identityWallet.create)).to.deep.equal(mockProps)
  //   })

  //   it('create.credential should return a correct credential', () => {
  //     const credential = identityWallet.create.credential({
  //       metadata: claimsMetadata.emailAddress,
  //       claim: singleClaimCreationArgs,
  //       subject: 'did:jolo:test'
  //     })
  //     const credentialFromJSON = Credential.fromJSON(singleClaimCredentialJSON)

  //     expect(credential).to.deep.equal(credentialFromJSON)
  //   })

  //   it('create.credentialRequestJSONWebToken should return a correct credentialRequest JWT', () => {
  //     const credRequestJWT = identityWallet.create.credentialRequestJSONWebToken(credentialRequestPayloadJson)
  //     const credRequestPayload = credRequestJWT.getPayload()

  //     expect(credRequestPayload).to.be.an.instanceof(CredentialRequestPayload)
  //     expect(credRequestPayload.credentialRequest).to.be.an.instanceof(CredentialRequest)
  //   })

  //   it('create.authenticationJSONWebToken should return a correct authentication JWT', () => {
  //     const authJWT = identityWallet.create.authenticationJSONWebToken(jsonAuthPayload)
  //     const authPayload = authJWT.getPayload()

  //     expect(authPayload).to.be.an.instanceof(AuthenticationPayload)
  //     expect(authPayload.authentication).to.be.an.instanceof(Authentication)
  //   })

  //   it('create.credentialReceiveJSONWebToken should return a correct credentialsReceive JWT', () => {
  //     const credReceiveJWT = identityWallet.create.credentialsReceiveJSONWebToken(jsonCredReceivePayload)
  //     const credReceivePayload = credReceiveJWT.getPayload()

  //     expect(credReceivePayload).to.be.an.instanceof(CredentialsReceivePayload)
  //     expect(credReceivePayload.credentialsReceive).to.be.an.instanceof(CredentialsReceive)
  //   })

  //   it('create.credentialOfferRequestJSONWebToken should return a correct credentialOfferRequest JWT', () => {
  //     const credOfferReqJWT = identityWallet.create
  //       .credentialOfferRequestJSONWebToken(credOfferRequestPayloadCreateArgs)
  //     const credOfferRequestPayload = credOfferReqJWT.getPayload()

  //     expect(credOfferRequestPayload).to.be.an.instanceof(CredentialOfferRequestPayload)
  //     expect(credOfferRequestPayload.credentialOffer).to.be.an.instanceof(CredentialOffer)
  //   })

  //   it('create.credentialOfferResponseJSONWebToken should return a correct credentialOfferResponse JWT', () => {
  //     const credOfferResJWT = identityWallet.create
  //       .credentialOfferResponseJSONWebToken(credOfferResponsePayloadCreateArgs)
  //     const credOfferResponsePayload = credOfferResJWT.getPayload()

  //     expect(credOfferResponsePayload).to.be.an.instanceof(CredentialOfferResponsePayload)
  //     expect(credOfferResponsePayload.credentialOffer).to.be.an.instanceof(CredentialOffer)
  //   })

  //   it('create.signedCredential should return a correct signed credential', async () => {
  //     const credAttr = { metadata: claimsMetadata.emailAddress, claim: singleClaimCreationArgs, subject: testSubject }
  //     const signedCred = await identityWallet.create.signedCredential(credAttr)
  //     const mockSignedCred = SignedCredential.fromJSON(testSignedCred)

  //     expect(signedCred.getIssuer()).to.deep.equal(mockSignedCred.getIssuer())
  //     expect(signedCred.getCredentialSection()).to.deep.equal(mockSignedCred.getCredentialSection())
  //     expect(signedCred.getType()).to.deep.equal(mockSignedCred.getType())
  //   })
  // })

  // describe('sign', () => {
  //   let signCredential
  //   let iWallet

  //   before(() => {
  //     signCredential = sandbox.spy(IdentityWallet.prototype, 'signCredential')
  //     iWallet = IdentityWallet.create({
  //       privateIdentityKey: testPrivateIdentityKey,
  //       identity
  //     })
  //   })

  //   after(() => {
  //     sandbox.restore()
  //   })

  //   it('sign.credential should call signCredential with correct params', () => {
  //     const credential = iWallet.create.credential({
  //       metadata: claimsMetadata.emailAddress,
  //       claim: singleClaimCreationArgs,
  //       subject: testSubject
  //     })
  //     iWallet.sign.credential(credential)

  //     sandbox.assert.calledOnce(signCredential)
  //     sandbox.assert.calledWith(signCredential, credential)
  //   })
  // })

  // describe('getter and setter for Identity', () => {
  //   it('getIdentity should return a correct instance of identity class ', () => {
  //     expect(identityWallet.getIdentity()).to.be.instanceof(Identity)
  //   })
  // })

  // describe('signCredential', () => {

  //   it('should return a correct signed credential', async () => {
  //     const credential = identityWallet.create.credential({
  //       metadata: claimsMetadata.emailAddress,
  //       claim: singleClaimCreationArgs,
  //       subject: testSubject
  //     })
  //     const signedCred = await identityWallet.signCredential(credential)
  //     const mockSignedCred = SignedCredential.fromJSON(testSignedCred)

  //     expect(signedCred.getIssuer()).to.deep.equal(mockSignedCred.getIssuer())
  //     expect(signedCred.getCredentialSection()).to.deep.equal(mockSignedCred.getCredentialSection())
  //     expect(signedCred.getType()).to.deep.equal(mockSignedCred.getType())
  //   })
  // })
})
