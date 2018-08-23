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

      expect(await committedProfile.publicProfile.get().validateSignature(jolocomRegistry)).to.be.true
    })
  })
})
