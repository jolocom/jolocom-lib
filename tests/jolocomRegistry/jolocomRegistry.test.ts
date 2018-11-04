import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { IpfsStorageAgent, jolocomIpfsStorageAgent } from '../../ts/ipfs/ipfs'
import { EthResolver, jolocomEthereumResolver } from '../../ts/ethereum/ethereum'
import { JolocomRegistry, createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { Identity } from '../../ts/identity/identity'
import { testEthereumConfig, testIpfsConfig } from '../data/registry.data'
import { IVaultedKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { testPublicIdentityKey, testPrivateEthereumKey, testPrivateIdentityKey } from '../data/keys.data'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { didDocumentJSON } from '../data/didDocument.data'
import { KeyTypes } from '../../ts/vaultedKeyProvider/types'
import { IEthereumConnector } from '../../ts/ethereum/types'
import { IIpfsConfig, IIpfsConnector } from '../../ts/ipfs/types'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { publicProfileCredJSON } from '../data/identity.data'

chai.use(sinonChai)
const expect = chai.expect

describe('JolocomRegistry', () => {
  let sandbox = sinon.createSandbox()
  let jolocomRegistry: JolocomRegistry

  afterEach(() => {
    sandbox.reset()
  })

  describe('static create', () => {
    const ipfsConnector = new IpfsStorageAgent(testIpfsConfig)
    const ethereumConnector = new EthResolver(testEthereumConfig)
    jolocomRegistry = createJolocomRegistry({ ipfsConnector, ethereumConnector })

    it('should correctly create an instance of JolocomRegistry if connectors are passed ', () => {
      expect(jolocomRegistry.ipfsConnector).to.deep.equal(ipfsConnector)
      expect(jolocomRegistry.ethereumConnector).to.deep.equal(ethereumConnector)
    })

    it('should create an instance of JolocomRegistry with correct config', () => {
      const defaultJolocomRegistry = createJolocomRegistry()
      expect(defaultJolocomRegistry.ipfsConnector).to.deep.equal(jolocomIpfsStorageAgent)
      expect(defaultJolocomRegistry.ethereumConnector).to.deep.equal(jolocomEthereumResolver)
    })
  })

  describe('instance methods', () => {
    let identityWallet: IdentityWallet
    let commit
    let fromPublicKey
    let fromDidDocument

    const mockVault = {
      getPublicKey: sinon.stub().returns(testPublicIdentityKey),
      signDigestable: sinon.stub().returns(Buffer.from('ffff', 'hex')),
      getPrivateKey: sinon.stub().returns(testPrivateIdentityKey)
    } as IVaultedKeyProvider

    const keyMetadata = {
      derivationPath: KeyTypes.jolocomIdentityKey,
      encryptionPass: '-'
    }

    describe('should create identity', () => {
      before(async () => {
        commit = sandbox.stub(JolocomRegistry.prototype, 'commit').resolves()
        fromPublicKey = sandbox.stub(DidDocument, 'fromPublicKey').returns(DidDocument.fromJSON(didDocumentJSON))
        fromDidDocument = sandbox.stub(Identity, 'fromDidDocument').returns(new Identity())
      })

      after(() => {
        sandbox.restore()
      })

      it('should create new identity', async () => {
        const jolocomRegistry = createJolocomRegistry()

        const expectedDidDocument = {
          ...didDocumentJSON,
          proof: {
            ...didDocumentJSON.proof,
            signatureValue: 'ffff'
          }
        }

        identityWallet = await jolocomRegistry.create(mockVault, '-')

        sandbox.assert.calledWith(mockVault.getPublicKey, keyMetadata)
        sandbox.assert.calledWith(fromDidDocument, { didDocument: DidDocument.fromJSON(expectedDidDocument) })

        sandbox.assert.calledWith(commit, {
          identityWallet: identityWallet,
          keyMetadata: { ...keyMetadata, derivationPath: KeyTypes.ethereumKey },
          vaultedKeyProvider: mockVault
        })
      })
    })

    describe('commit', () => {
      const didDocument = DidDocument.fromJSON(didDocumentJSON)

      it('should commit without public profile', async () => {
        const mockEth = jolocomEthereumResolver
        mockEth.resolveDID = sinon.stub().returns(Identity.fromDidDocument({ didDocument }))

        const mockUpdate = (mockEth.updateDIDRecord = sinon.stub())
        const mockIpfs = jolocomIpfsStorageAgent
        const mockStore = (mockIpfs.storeJSON = sinon.stub().returns('QmW'))

        const testRegistry = createJolocomRegistry({
          ethereumConnector: mockEth,
          ipfsConnector: mockIpfs
        })

        const mockIdentity = {
          publicProfile: {
            get: sinon.stub().returns(SignedCredential.fromJSON(publicProfileCredJSON))
          }
        } as Identity

        const identityWallet = new IdentityWallet({
          identity: mockIdentity,
          vaultedKeyProvider: mockVault,
          publicKeyMetadata: {
            derivationPath: keyMetadata.derivationPath,
            keyId: didDocumentJSON.publicKey[0].id
          }
        })

        identityWallet.getDidDocument = sinon.stub().returns(didDocument)

        await testRegistry.commit({
          vaultedKeyProvider: mockVault,
          identityWallet,
          keyMetadata: keyMetadata
        })

        expect(mockStore.getCall(0).args).to.deep.eq([{ data: publicProfileCredJSON, pin: true }])
        expect(mockStore.getCall(1).args).to.deep.eq([{ data: didDocument.toJSON(), pin: true }])

        expect(mockUpdate.getCall(0).args).to.deep.eq([
          {
            did: didDocument.getDid(),
            newHash: 'QmW',
            ethereumKey: testPrivateIdentityKey
          }
        ])
      })

      it('should commit with public profile', () => {})
      it('should commit with updated public profile')
      it('should commit with removed public profile')
    })
    it('should implement commit', () => {
      // sandbox.assert.calledOnce(commit)
    })

    it('should return proper identityWallet instance on create', () => {
      // expect(identityWallet).to.be.instanceof(IdentityWallet)
    })
  })
})
