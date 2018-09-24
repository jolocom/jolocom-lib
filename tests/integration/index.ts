import { CredentialResponse } from './../../ts/interactionFlows/credentialResponse/credentialResponse';
import { ICredentialResponsePayloadCreationAttrs } from './../../js/interactionFlows/credentialResponse/types.d';
import { InteractionType } from './../../ts/interactionFlows/types'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { testPrivateIdentityKey, testPrivateEthereumKey } from '../data/keys'
import { DidDocument } from '../../ts/identity/didDocument'
import * as integrationHelper from './provision'
import { IIpfsConfig } from '../../ts/ipfs/types'
import { IpfsStorageAgent } from '../../ts/ipfs'
import { IEthereumResolverConfig } from '../../ts/ethereum/types'
import { EthResolver } from '../../ts/ethereum'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { claimsMetadata } from '../../ts/index'
import { JSONWebToken } from './../../ts/interactionFlows/JSONWebToken';
import { CredentialRequest } from './../../ts/interactionFlows/credentialRequest/credentialRequest'
import { defaultContext } from './../../ts/utils/contexts'
import { ICredentialRequestPayloadCreationAttrs } from './../../js/interactionFlows/credentialRequest/types.d'

chai.use(sinonChai)
const expect = chai.expect

describe('Integration Test', () => {
  let jolocomRegistry
  const did = 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af'

  before(async function() {
    this.timeout(40000)
    const address = await integrationHelper.init()

    const ipfsConfig: IIpfsConfig = {
      protocol: 'http',
      port: 5001,
      host: '127.0.0.1'
    }
    const ethereumConfig: IEthereumResolverConfig = {
      providerUrl: 'http://127.0.0.1:8945',
      contractAddress: address
    }

    const ipfsConnector = new IpfsStorageAgent(ipfsConfig)
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
      expect(didDocument.getDID()).to.eq(did)
    })
  })

  describe('Authentication', () => {
    it('should return authenticated identity wallet', async () => {
      const identityWallet = await jolocomRegistry.authenticate(testPrivateIdentityKey)
      expect(identityWallet).to.be.an.instanceOf(IdentityWallet)
      expect(identityWallet.getIdentity().getDID()).to.eq(did)
    })
  })

  describe('Public Profile', () => {
    it('should correctly add and commit public profile credential', async () => {
      const identityWallet = await jolocomRegistry.authenticate(testPrivateIdentityKey)
      const publicProfileCredential = await identityWallet.create.signedCredential({
        metadata: claimsMetadata.publicProfile,
        claim: {
          name: 'Test Name',
          description: 'Test Description'
        }
      })

      identityWallet.getIdentity().publicProfile.add(publicProfileCredential)
      await jolocomRegistry.commit({ wallet: identityWallet, privateEthereumKey: testPrivateEthereumKey })

      const committedProfile = await jolocomRegistry.resolve(did)

      expect(committedProfile.publicProfile.get().getCredentialSection()).to.deep.equal({
        id: did,
        name: 'Test Name',
        description: 'Test Description'
      })
    })
  })

  describe('Signature verification', () => {
    it('should generate a valid DDO public profile', async () => {
      const committedProfile = await jolocomRegistry.resolve(did)
      const publicKey = committedProfile.getPublicKeySection()[0].getPublicKeyHex()

      expect(
        await committedProfile.publicProfile.get().validateSignatureWithPublicKey(Buffer.from(publicKey, 'hex')
      )).to.be.true
    })
  })

  describe('SSO interaction flow', async () => {

    const testSignedCreds = [{
      '@context': defaultContext,
      id: 'claimId:bcf70ac9c940e',
      name: 'Email address',
      issuer: 'did:jolo:issuer',
      type: [ 'Credential', 'MockCredential' ],
      claim: {
        id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
        email: 'testUser@jolocom.com'
      },
      issued: '1970-01-01T00:00:00.000Z',
      proof: {
        type: 'EcdsaKoblitzSignature2016',
        created: '1970-01-01T00:00:00.000Z',
        creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#claimId:bcf70ac9c940e',
        nonce: '90a6764469fc4',
        signatureValue: 'TlGz5inRY4T7GyvZi3eDq22GCEVoMlhb0mAhz7xc9y1CPe6e8PCLFK3fL4ajSD4pQhK0vFPZ3dUOdDPuopYhKQ=='
      }
    },
    {
      '@context': defaultContext,
      id: 'claimId:bcf70ac9c940e',
      name: 'Email address',
      issuer: 'did:jolo:anotherIssuer',
      type: [ 'Credential', 'MockCredential' ],
      claim: {
        id: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af',
        email: 'testUser2@jolocom.com'
      },
      issued: '1970-01-01T00:00:00.000Z',
      proof: {
        type: 'EcdsaKoblitzSignature2016',
        created: '1970-01-01T00:00:00.000Z',
        creator: 'did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af#claimId:bcf70ac9c940e',
        nonce: '90a6764469fc4',
        signatureValue: 'TlGz5inRY4T7GyvZi3eDq22GCEVoMlhb0mAhz7xc9y1CPe6e8PCLFK3fL4ajSD4pQhK0vFPZ3dUOdDPuopYhKQ=='
      }
    }]

    let credentialRequestJWT
    let encodedJWT
    let filteredCredentials
    let credentialResponseJWT

    it('should allow for simple generation of credential requests', async () => {

      const credentialRequestCreationPayload: ICredentialRequestPayloadCreationAttrs = {
        typ: InteractionType.CredentialRequest,
        credentialRequest: {
          callbackURL: 'http://test.com',
          credentialRequirements: [
            {
              type: ['Credential', 'MockCredential'],
              constraints: [{ '==': [{ var: 'issuer' }, 'did:jolo:issuer'] }]
            }
          ]
        }
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
