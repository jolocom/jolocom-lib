import { InteractionType } from './../../ts/interactionFlows/types'
import * as chai from 'chai'
import {
  testPrivateIdentityKey,
  testPrivateEthereumKey,
  testPrivateIdentityKey3,
  testPrivateEthereumKey3
} from '../data/keys'
import { thirdMockCredential } from '../data/credential/signedCredential'
import { DidDocument } from '../../ts/identity/didDocument'
import * as integrationHelper from './provision'
import { IpfsStorageAgent } from '../../ts/ipfs'
import { IEthereumResolverConfig } from '../../ts/ethereum/types'
import { EthResolver } from '../../ts/ethereum'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { claimsMetadata, JolocomLib } from '../../ts/index'
import { JSONWebToken } from './../../ts/interactionFlows/JSONWebToken'
import { CredentialRequest } from './../../ts/interactionFlows/credentialRequest/credentialRequest'
import {
  testClaim,
  sampleCredentialRequest,
  sampleDid,
  integrationTestIpfsConfig,
  ethereumConfigProviderUrl,
  testSignedCredentialIntegration
} from './../data/interactionFlows/integrationTest'
import { CredentialResponse } from './../../ts/interactionFlows/credentialResponse/credentialResponse'
import * as jr from '../../ts/registries/jolocomRegistry'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { CredentialRequestPayload } from '../../ts/interactionFlows/credentialRequest/credentialRequestPayload'
import { CredentialResponsePayload } from '../../ts/interactionFlows/credentialResponse/credentialResponsePayload'
import { Authentication } from '../../ts/interactionFlows/authentication/authentication'
import { AuthenticationPayload } from '../../ts/interactionFlows/authentication/authenticationPayload'
import { CredentialsReceivePayload } from '../../ts/interactionFlows/credentialsReceive/credentialsReceivePayload'
import {
  CredentialOfferRequestPayload
} from '../../ts/interactionFlows/credentialOfferRequest/credentialOfferRequestPayload'
import {
  CredentialOfferResponsePayload
} from '../../ts/interactionFlows/credentialOfferResponse/credentialOfferResponsePayload'

const expect = chai.expect

describe('Integration Test', () => {
  let jolocomRegistry

  before(async function() {
    this.timeout(40000)
    const address = await integrationHelper.init()

    const ethereumConfig: IEthereumResolverConfig = {
      providerUrl: ethereumConfigProviderUrl,
      contractAddress: address
    }

    const ipfsConnector = new IpfsStorageAgent(integrationTestIpfsConfig)
    const ethereumConnector = new EthResolver(ethereumConfig)

    jolocomRegistry = createJolocomRegistry({ ipfsConnector, ethereumConnector })
  })

  after(() => {
    process.exit(0)
  })

  describe('Creation of identity', () => {
    it('should generate a valid DDO', async () => {
      const identityWallet: IdentityWallet = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey,
        privateEthereumKey: testPrivateEthereumKey
      })
      const didDocument = identityWallet.getIdentity().didDocument

      expect(didDocument).to.be.an.instanceOf(DidDocument)
      expect(didDocument.getDID()).to.eq(sampleDid)
    })
  })

  describe('Authentication', () => {
    it('should return authenticated identity wallet', async () => {
      const identityWallet = await jolocomRegistry.authenticate(testPrivateIdentityKey)

      expect(identityWallet).to.be.an.instanceOf(IdentityWallet)
      expect(identityWallet.getIdentity().getDID()).to.eq(sampleDid)
    })
  })

  describe('Public Profile', () => {
    it('should correctly add and commit public profile credential', async () => {
      const identityWallet = await jolocomRegistry.authenticate(testPrivateIdentityKey)
      const publicProfileCredential = await identityWallet.create.signedCredential({
        metadata: claimsMetadata.publicProfile,
        claim: testClaim
      })

      identityWallet.getIdentity().publicProfile.add(publicProfileCredential)
      await jolocomRegistry.commit({ wallet: identityWallet, privateEthereumKey: testPrivateEthereumKey })

      const committedProfile = await jolocomRegistry.resolve(sampleDid)

      expect(committedProfile.publicProfile.get().getCredentialSection()).to.deep.equal({
        id: sampleDid,
        name: 'Test Name',
        description: 'Test Description'
      })
    })
  })

  describe('Signature verification', () => {
    it('should generate a valid DDO public profile', async () => {
      const committedProfile = await jolocomRegistry.resolve(sampleDid)
      const publicKey = committedProfile.getPublicKeySection()[0].getPublicKeyHex()
      // tslint:disable-next-line:no-unused-expression
      expect(
        await committedProfile.publicProfile.get().validateSignatureWithPublicKey(Buffer.from(publicKey, 'hex')
      )).to.be.true
    })
  })

  describe('SSO interaction flow', () => {
    let identityWalletUser
    let identityWalletService

    before(async () => {
      identityWalletUser = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey,
        privateEthereumKey: testPrivateEthereumKey
      })

      identityWalletService = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey3,
        privateEthereumKey: testPrivateEthereumKey3
      })
    })

    let credRequestJWTClass
    let credRequestJWT
    let credResponseJWTClass
    let credResponseJWT

    it('should allow for simple generation of credential requests by service', async () => {
      credRequestJWTClass = identityWalletService.create.credentialRequestJSONWebToken({
        typ: InteractionType.CredentialRequest,
        credentialRequest: sampleCredentialRequest
      })

      credRequestJWT = credRequestJWTClass.encode()

      expect(credRequestJWTClass.getPayload()).to.be.an.instanceOf(CredentialRequestPayload)
      expect(credRequestJWTClass.getPayload().credentialRequest)
        .to.be.an.instanceOf(CredentialRequest)
    })

    it('should allow for simple consumption of signed credential requests by user', async () => {
      const credRequest = await JSONWebToken.decode(credRequestJWT, jolocomRegistry)

      const filteredCredentials = credRequest.applyConstraints([
        testSignedCredentialIntegration, thirdMockCredential
      ])

      expect(credRequest).to.be.an.instanceOf(CredentialRequestPayload)
      // tslint:disable
      expect(credRequest.getCallbackURL()).to.exist
      expect(credRequest.getRequestedCredentialTypes()).to.exist
      expect(credRequest.applyConstraints).to.exist
      // tslint:enable
      expect(filteredCredentials).to.deep.equal([testSignedCredentialIntegration])
    })

    it('should allow for simple generation of appropriate credential response by user', async () => {
      credResponseJWTClass = identityWalletUser.create.credentialResponseJSONWebToken({
        typ: InteractionType.CredentialResponse,
        credentialResponse: {
          suppliedCredentials: [testSignedCredentialIntegration]
        }
      })

      credResponseJWT = credResponseJWTClass.encode()

      const credRequest = await JSONWebToken.decode(credRequestJWT, jolocomRegistry)

      expect(credResponseJWTClass.getPayload()).to.be.an.instanceof(CredentialResponsePayload)
      expect(credResponseJWTClass.getPayload().credentialResponse).to.be.an.instanceof(CredentialResponse)
      expect(credResponseJWTClass.getPayload().getSuppliedCredentials()[0])
        .to.be.an.instanceOf(SignedCredential)
      // tslint:disable-next-line:no-unused-expression
      expect(credResponseJWTClass.getPayload().credentialResponse
        .satisfiesRequest(credRequest)).to.be.true
    })

    it('should validate signature of signed credential on credential response', async () => {
      const credResponse = await JSONWebToken.decode(credResponseJWT, jolocomRegistry)

      const suppliedCredentials = credResponse.getSuppliedCredentials()
      const valid = await jolocomRegistry
        .validateSignature(suppliedCredentials[0])
      // tslint:disable-next-line:no-unused-expression
      expect(valid).to.be.true
    })
  })

  describe('Credential sharing flow ', () => {
    let identityWalletUser
    let identityWalletService

    before(async () => {
      identityWalletUser = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey,
        privateEthereumKey: testPrivateEthereumKey
      })

      identityWalletService = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey3,
        privateEthereumKey: testPrivateEthereumKey3
      })
    })

    let authRequestJWTClass
    let authRequestJWT
    let authResponseJWTClass
    let authResponseJWT

    let credentialFromService
    let credentialReceiveJWT

    it('Should allow for simple generation of an authentication request by service', () => {
      authRequestJWTClass = identityWalletService.create.authenticationJSONWebToken({
        typ: InteractionType.Authentication,
        authentication: {
          challenge: 'jwnfoöwihvibvrjkn',
          callbackURL: 'https://www.test.io/auth'
        }
      })
      authRequestJWT = authRequestJWTClass.encode()

      expect(authRequestJWTClass.getPayload()).to.be.an.instanceOf(AuthenticationPayload)
      expect(authRequestJWTClass.getPayload().authentication).to.be.an.instanceOf(Authentication)
    })
    // tslint:disable-next-line
    it('Should allow for simple consumption of authentication request and generate authentication response by user', async () => {
      const authRequest = await JSONWebToken.decode(authRequestJWT, jolocomRegistry)

      authResponseJWTClass = identityWalletUser.create.authenticationJSONWebToken({
        typ: InteractionType.Authentication,
        authentication: authRequest.getAuthentication().toJSON()
      })
      authResponseJWT = authResponseJWTClass.encode()

      expect(authRequest).to.be.an.instanceOf(AuthenticationPayload)
      expect(authRequest.authentication).to.be.an.instanceOf(Authentication)
      expect(authResponseJWTClass).to.be.instanceOf(JSONWebToken)
    })
    // tslint:disable-next-line
    it('Should allow for authentication response consumption & validation and credentialsReceive creation by service', async () => {
      const authResponse = await JSONWebToken.decode(authResponseJWT, jolocomRegistry)

      const validChallenge = authResponse.validateChallenge(authRequestJWTClass.getPayload())

      if (!validChallenge) {
        throw new Error('Challenge does not match requested challenge')
      }

      expect(authResponse).to.be.an.instanceOf(AuthenticationPayload)
      // tslint:disable-next-line:no-unused-expression
      expect(authResponse.validateChallenge).to.exist
      // tslint:disable-next-line:no-unused-expression
      expect(validChallenge).to.be.true

      credentialFromService = await identityWalletService.create.signedCredential({
        metadata: claimsMetadata.emailAddress,
        claim: {
          email: 'helloworld@test.com'
        },
        subject: authResponse.iss
      })

      const credReceiveJWTClass = identityWalletService.create.credentialsReceiveJSONWebToken({
        typ: InteractionType.CredentialsReceive,
        credentialsReceive: {
          signedCredentials: [ credentialFromService ]
        }
      })

      credentialReceiveJWT = credReceiveJWTClass.encode()

      expect(credentialFromService).to.be.an.instanceOf(SignedCredential)
      expect(credReceiveJWTClass).to.be.an.instanceOf(JSONWebToken)
      expect(credReceiveJWTClass.getPayload()).to.be.an.instanceOf(CredentialsReceivePayload)
    })

    it('Should allow for consumption of credentialsReceieve with correct signed credential by user', async () => {
      const credReceive = await JSONWebToken.decode(credentialReceiveJWT, jolocomRegistry)

      const providedCredentials = credReceive.getSignedCredentials()
      const validCredSignature = await jolocomRegistry
        .validateSignature(providedCredentials[0])

      expect(credReceive).to.be.an.instanceOf(CredentialsReceivePayload)
      // tslint:disable-next-line:no-unused-expression
      expect(credReceive.getSignedCredentials).to.exist
      expect(providedCredentials[0]).to.be.an.instanceOf(SignedCredential)
      // tslint:disable-next-line:no-unused-expression
      expect(validCredSignature).to.be.true
      expect(providedCredentials[0].getIssuer()).to.deep.equal(credentialFromService.getIssuer())
      expect(providedCredentials[0].getCredentialSection())
        .to.deep.equal(credentialFromService.getCredentialSection())
    })
  })

  describe('Instant credential exchange flow for third party credential', () => {
    let identityWalletUser
    let identityWalletService

    before(async () => {
      identityWalletUser = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey,
        privateEthereumKey: testPrivateEthereumKey
      })

      identityWalletService = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey3,
        privateEthereumKey: testPrivateEthereumKey3
      })
    })

    let credentialOfferRequestJWT
    let credentialOfferResponseJWT

    it('Should create a correct credential offer request JWT', () => {
      const credOfferRequest = identityWalletService.create.credentialOfferRequestJSONWebToken({
        typ: 'credentialOfferRequest',
        credentialOffer: {
          challenge: 'zgbioH42',
          callbackURL: 'https://test.de/external-cred',
          instant: true,
          requestedInput: {}
        }
      })
      credentialOfferRequestJWT = credOfferRequest.encode()

      expect(credOfferRequest.getPayload()).to.be.an.instanceOf(CredentialOfferRequestPayload)
    })

    it('Should allow for consumption of credential offer request JWT', async () => {
      const credOfferRequest = await JolocomLib.parse.interactionJSONWebToken.decode(credentialOfferRequestJWT, jolocomRegistry)

      expect(credOfferRequest).to.be.an.instanceOf(CredentialOfferRequestPayload)
    })

    it('Should correctly create a credential offer response JWT', async () => {
      const credOfferRequest = await JolocomLib.parse.interactionJSONWebToken.decode(credentialOfferRequestJWT, jolocomRegistry)

      const credOfferResponse = identityWalletUser.create.credentialOfferResponseJSONWebToken({
        typ: 'credentialOfferResponse',
        credentialOffer: {
          challenge: credOfferRequest.getChallenge(),
          callbackURL: credOfferRequest.getCallbackURL(),
          instant: true,
          requestedInput: {}
        }
      })
      credentialOfferResponseJWT = credOfferResponse.encode()

      expect(credOfferResponse.getPayload()).to.be.an.instanceOf(CredentialOfferResponsePayload)
    })

    it('Should allow for consumption of credential offer response JWT', async () => {
      const credOfferResponse = await JolocomLib.parse.interactionJSONWebToken.decode(credentialOfferResponseJWT, jolocomRegistry)

      expect(credOfferResponse).to.be.an.instanceOf(CredentialOfferResponsePayload)
    })
    /* After a succesfull credential offer exchange the credential receive flow would be triggered
      see the "Credential sharing flow" for more details
    */
  })
})
