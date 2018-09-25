import { InteractionType } from './../../ts/interactionFlows/types'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { testPrivateIdentityKey, testPrivateEthereumKey } from '../data/keys'
import { DidDocument } from '../../ts/identity/didDocument'
import * as integrationHelper from './provision'
import { IpfsStorageAgent } from '../../ts/ipfs'
import { IEthereumResolverConfig } from '../../ts/ethereum/types'
import { EthResolver } from '../../ts/ethereum'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { claimsMetadata } from '../../ts/index'
import { JSONWebToken } from './../../ts/interactionFlows/JSONWebToken';
import { CredentialRequest } from './../../ts/interactionFlows/credentialRequest/credentialRequest'
import { ICredentialRequestPayloadCreationAttrs } from './../../js/interactionFlows/credentialRequest/types.d'
import {
  testClaim,
  testSignedCreds,
  sampleCredentialRequest,
  sampleDid,
  integrationTestIpfsConfig,
  ethereumConfigProviderUrl
} from './../data/interactionFlows/integrationTest';
import { CredentialResponse } from './../../ts/interactionFlows/credentialResponse/credentialResponse';
import { ICredentialResponsePayloadCreationAttrs } from './../../js/interactionFlows/credentialResponse/types.d';

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

  describe('SSO interaction flow', async () => {

    let credentialRequestJWT
    let encodedJWT
    let filteredCredentials
    let credentialResponseJWT

    it('should allow for simple generation of credential requests', async () => {

      const credentialRequestCreationPayload: ICredentialRequestPayloadCreationAttrs = {
        typ: InteractionType.CredentialRequest,
        credentialRequest: sampleCredentialRequest
      }

      const identityWallet: IdentityWallet = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey,
        privateEthereumKey: testPrivateEthereumKey
      })
      credentialRequestJWT = identityWallet.create.credentialRequestJSONWebToken(credentialRequestCreationPayload)
      encodedJWT = credentialRequestJWT.encode()
      expect(credentialRequestJWT.getPayload().credentialRequest).to.be.an.instanceof(CredentialRequest)
    })

    it('should allow for simple consumption of credential requests', async () => {

      const decoded = JSONWebToken.decode(encodedJWT)
      filteredCredentials = decoded.applyConstraints(testSignedCreds)
      expect(filteredCredentials[0]).to.deep.equal(testSignedCreds[0])
    })

    it('should allow for simple generation of appropriate of credential response', async () => {
      const identityWallet: IdentityWallet = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey,
        privateEthereumKey: testPrivateEthereumKey
      })

      const credentialResponseCreationPayload: ICredentialResponsePayloadCreationAttrs = {
        typ: InteractionType.CredentialResponse,
        credentialResponse: filteredCredentials
      }

      credentialResponseJWT = identityWallet.create.credentialResponseJSONWebToken(credentialResponseCreationPayload)
      const credRequest = credentialRequestJWT.getPayload().credentialRequest
      const credResp = credentialResponseJWT.getPayload().credentialResponse
      expect(credentialResponseJWT.getPayload().credentialResponse).to.be.an.instanceof(CredentialResponse)
      expect(credResp.satisfiesRequest(credRequest)).to.be.true
    })
  })
})
