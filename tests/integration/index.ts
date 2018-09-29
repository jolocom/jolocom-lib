import { InteractionType } from './../../ts/interactionFlows/types'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import * as sinon from 'sinon'
import {
  testPrivateIdentityKey,
  testPrivateEthereumKey,
  testPrivateIdentityKey3,
  testPrivateEthereumKey3
} from '../data/keys'
import { testSignedCredentialDefault, thirdMockCredential } from '../data/credential/signedCredential'
import { DidDocument } from '../../ts/identity/didDocument'
import * as integrationHelper from './provision'
import { IpfsStorageAgent } from '../../ts/ipfs'
import { IEthereumResolverConfig } from '../../ts/ethereum/types'
import { EthResolver } from '../../ts/ethereum'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { claimsMetadata } from '../../ts/index'
import { JSONWebToken } from './../../ts/interactionFlows/JSONWebToken'
import { CredentialRequest } from './../../ts/interactionFlows/credentialRequest/credentialRequest'
import {
  testClaim,
  sampleCredentialRequest,
  sampleDid,
  integrationTestIpfsConfig,
  ethereumConfigProviderUrl
} from './../data/interactionFlows/integrationTest'
import { CredentialResponse } from './../../ts/interactionFlows/credentialResponse/credentialResponse'
import * as jr from '../../ts/registries/jolocomRegistry'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential';
import { CredentialRequestPayload } from '../../ts/interactionFlows/credentialRequest/credentialRequestPayload'
import { CredentialResponsePayload } from '../../ts/interactionFlows/credentialResponse/credentialResponsePayload'

chai.use(sinonChai)
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
      sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
      const credRequest = await JSONWebToken.decode(credRequestJWT)
      sinon.restore()

      const filteredCredentials = credRequest.applyConstraints([
        testSignedCredentialDefault, thirdMockCredential
      ])

      expect(credRequest).to.be.an.instanceOf(CredentialRequestPayload)
      expect(credRequest.getCallbackURL()).to.exist
      expect(credRequest.getRequestedCredentialTypes()).to.exist
      expect(credRequest.applyConstraints).to.exist
      expect(filteredCredentials).to.deep.equal([testSignedCredentialDefault])
    })

    it('should allow for simple generation of appropriate credential response by user', async () => {
      credResponseJWTClass = identityWalletUser.create.credentialResponseJSONWebToken({
        typ: InteractionType.CredentialResponse,
        credentialResponse: {
          suppliedCredentials: [testSignedCredentialDefault]
        }
      })
     
      credResponseJWT = credResponseJWTClass.encode()
      
      sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
      const credRequest = await JSONWebToken.decode(credRequestJWT)
      sinon.restore()
      
      expect(credResponseJWTClass.getPayload()).to.be.an.instanceof(CredentialResponsePayload)
      expect(credResponseJWTClass.getPayload().credentialResponse).to.be.an.instanceof(CredentialResponse)
      expect(credResponseJWTClass.getPayload().getSuppliedCredentials()[0])
        .to.be.an.instanceOf(SignedCredential)
      expect(credResponseJWTClass.getPayload().credentialResponse
        .satisfiesRequest(credRequest)).to.be.true
    })

    it('should validate signature of signed credential on credential response', async () => {
      sinon.stub(jr, 'createJolocomRegistry').returns(jolocomRegistry)
      const credResponse = await JSONWebToken.decode(credResponseJWT)
      sinon.restore()

      const suppliedCredentials = credResponse.getSuppliedCredentials()
      const valid = await jolocomRegistry
        .validateSignature(suppliedCredentials[0])  
      
      expect(valid).to.be.true
    })
  })
})
