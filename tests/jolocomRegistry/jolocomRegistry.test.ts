// import * as sinon from 'sinon'
// import * as chai from 'chai'
// import * as sinonChai from 'sinon-chai'
// import { IpfsStorageAgent, jolocomIpfsStorageAgent } from '../../ts/ipfs'
// import { EthResolver, jolocomEthereumResolver } from '../../ts/ethereum'
// import { JolocomRegistry, createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
// import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
// import { Identity } from '../../ts/identity/identity'
// import { testEthereumConfig, testIpfsConfig } from '../data/registry'
// import { SoftwareKeyProvider, IVaultedKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
// import { testSeed, testPublicIdentityKey } from '../data/keys'
// import { DidDocument } from '../../ts/identity/didDocument'
// import { didDocumentJSON } from '../data/didDocument'
// import { KeyTypes } from '../../ts/vaultedKeyProvider/types'

// chai.use(sinonChai)
// const expect = chai.expect

// describe('JolocomRegistry', () => {
//   let sandbox

//   beforeEach(() => {
//     sandbox = sinon.createSandbox()
//   })

//   afterEach(() => {
//     sandbox.restore()
//   })

//   describe('static create', () => {
//     const ipfsConnector = new IpfsStorageAgent(testIpfsConfig)
//     const ethereumConnector = new EthResolver(testEthereumConfig)
//     const jolocomRegistry = createJolocomRegistry({ ipfsConnector, ethereumConnector })

//     it('should correctly create an instance of JolocomRegistry if connectors are passed ', () => {
//       expect(jolocomRegistry.ipfsConnector).to.deep.equal(ipfsConnector)
//       expect(jolocomRegistry.ethereumConnector).to.deep.equal(ethereumConnector)
//     })

//     it('should create an instance of JolocomRegistry with correct config', () => {
//       const defaultJolocomRegistry = createJolocomRegistry()
//       expect(defaultJolocomRegistry.ipfsConnector).to.deep.equal(jolocomIpfsStorageAgent)
//       expect(defaultJolocomRegistry.ethereumConnector).to.deep.equal(jolocomEthereumResolver)
//     })
//   })

//   describe('instance methods', () => {
//     let identityWallet: IdentityWallet
//     let commit
//     let fromPublicKey
//     let fromDidDocument

//     beforeEach(async () => {
//       const identity = new Identity()

//       commit = sandbox.stub(JolocomRegistry.prototype, 'commit').resolves()
//       fromPublicKey = sandbox.stub(DidDocument, 'fromPublicKey').returns(DidDocument.fromJSON(didDocumentJSON))
//       fromDidDocument = sandbox.stub(Identity, 'fromDidDocument').returns(identity)
//     })

//     describe('It should implement commit', () => {
//       gg
//     })
//     // it('should create new identity', async () => {
//     //   const jolocomRegistry = createJolocomRegistry()

//     //   const mockVault = {
//     //     getPublicKey: sinon.stub().returns(testPublicIdentityKey)
//     //   } as IVaultedKeyProvider

//     //   const keyMetadata = {
//     //     derivationPath: KeyTypes.jolocomIdentityKey,
//     //     encryptionPass: '-'
//     //   }

//     //   identityWallet = await jolocomRegistry.create(mockVault, '-')

//     //   sandbox.assert.calledOnce(mockVault.getPublicKey)
//     //   sandbox.assert.calledWith(mockVault.getPublicKey, keyMetadata)
//     //   sandbox.assert.calledOnce(fromPublicKey)
//     //   sandbox.assert.calledOnce(fromDidDocument)
//     //   sandbox.assert.calledWith(fromDidDocument, { didDocument: DidDocument.fromJSON(didDocumentJSON) })
//     //   sandbox.assert.calledOnce(commit)
//     //   sandbox.assert.calledWith(commit, {
//     //     identityWallet: identityWallet,
//     //     keyMetadata,
//     //     vaultedKeyProvider: mockVault
//     //   })
//     // })
//     // // it('should populate identity on the identity wallet', () => {
//     // //   expect(identityWallet.getIdentity()).to.be.instanceof(Identity)
//     // // })

//     // it('should call commit method once', () => {
//     //   sandbox.assert.calledOnce(commit)
//     // })

//     // it('should return proper identityWallet instance on create', () => {
//     //   expect(identityWallet).to.be.instanceof(IdentityWallet)
//     // })
//   })
// })
