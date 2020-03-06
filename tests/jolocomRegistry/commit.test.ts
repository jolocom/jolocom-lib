import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { Identity } from '../../ts/identity/identity'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { IKeyDerivationArgs } from '../../ts/vaultedKeyProvider/types'
import { testPrivateEthereumKey, testSeed } from '../data/keys.data'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import {
  didDocumentJSON,
  mockDid,
  mockIpfsHash,
} from '../data/didDocument.data'
import { KeyTypes } from '../../ts/vaultedKeyProvider/types'
import { encryptionPass } from './jolocomRegistry.data'
import { mockPubProfServiceEndpointJSON } from '../data/didDocumentSections.data'
import { publicProfileCredJSON } from '../data/identity.data'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { jolocomContractsAdapter } from '../../ts/contracts/contractsAdapter'
import { jolocomContractsGateway } from '../../ts/contracts/contractsGateway'
import { ErrorCodes } from '../../ts/errors'

chai.use(sinonChai)
const expect = chai.expect

describe('Jolocom registry - commit', () => {
  let sandbox = sinon.createSandbox()
  const vault = SoftwareKeyProvider.fromSeed(testSeed, encryptionPass)

  const keyMetadata = {
    derivationPath: KeyTypes.jolocomIdentityKey,
    encryptionPass,
  }

  const didDocument = DidDocument.fromJSON(didDocumentJSON)

  afterEach(() => {
    sandbox.restore()
  })

  before(() => {})

  it('should commit without public profile', async () => {
    const testRegistry: any = createJolocomRegistry()

    sandbox.stub(testRegistry, 'resolve').resolves()
    sandbox.stub(testRegistry.ethereumConnector, 'updateDIDRecord')
    sandbox.stub(testRegistry.ipfsConnector, 'storeJSON').returns(mockIpfsHash)

    const identityWallet = new IdentityWallet({
      identity: Identity.fromDidDocument({ didDocument }),
      vaultedKeyProvider: vault,
      publicKeyMetadata: {
        derivationPath: KeyTypes.jolocomIdentityKey,
        keyId: didDocumentJSON.publicKey[0].id,
      },
      contractsAdapter: jolocomContractsAdapter,
      contractsGateway: jolocomContractsGateway,
    })

    await testRegistry.commit({
      vaultedKeyProvider: vault,
      identityWallet,
      keyMetadata: { ...keyMetadata, derivationPath: KeyTypes.ethereumKey },
    })

    sandbox.assert.calledOnce(testRegistry.ipfsConnector.storeJSON)
    sandbox.assert.calledWith(testRegistry.resolve, mockDid)
    expect(
      testRegistry.ethereumConnector.updateDIDRecord.getCall(0).args,
    ).to.deep.eq([
      {
        did: mockDid,
        ethereumKey: testPrivateEthereumKey,
        newHash: mockIpfsHash,
      },
    ])

    sandbox.assert.calledWith(testRegistry.ipfsConnector.storeJSON, {
      data: didDocumentJSON,
      pin: true,
    })
  })

  it('should commit with local public profile, and no remote', async () => {
    const testRegistry: any = createJolocomRegistry()

    const extendedDidDocumentJSON = {
      ...didDocumentJSON,
      service: [mockPubProfServiceEndpointJSON],
    }
    const publicProfile = SignedCredential.fromJSON(publicProfileCredJSON)

    const localIdentity = Identity.fromDidDocument({
      didDocument,
      publicProfile,
    })
    const remoteIdentity = Identity.fromDidDocument({ didDocument })

    sandbox.stub(testRegistry, 'resolve').resolves(remoteIdentity)
    sandbox.stub(testRegistry.ipfsConnector, 'storeJSON').returns(mockIpfsHash)
    sandbox.stub(testRegistry.ethereumConnector, 'updateDIDRecord').returns()

    const identityWallet = new IdentityWallet({
      identity: localIdentity,
      vaultedKeyProvider: vault,
      publicKeyMetadata: {
        derivationPath: KeyTypes.jolocomIdentityKey,
        keyId: didDocumentJSON.publicKey[0].id,
      },
      contractsAdapter: jolocomContractsAdapter,
      contractsGateway: jolocomContractsGateway,
    })

    await testRegistry.commit({
      vaultedKeyProvider: vault,
      identityWallet,
      keyMetadata: { ...keyMetadata, derivationPath: KeyTypes.ethereumKey },
    })

    sandbox.assert.calledWith(testRegistry.resolve, mockDid)
    sandbox.assert.calledTwice(testRegistry.ipfsConnector.storeJSON)
    sandbox.assert.calledWith(testRegistry.ipfsConnector.storeJSON, {
      data: extendedDidDocumentJSON,
      pin: true,
    })
    sandbox.assert.calledWith(testRegistry.ipfsConnector.storeJSON, {
      data: publicProfileCredJSON,
      pin: true,
    })
    sandbox.assert.calledWith(testRegistry.ethereumConnector.updateDIDRecord, {
      did: mockDid,
      ethereumKey: testPrivateEthereumKey,
      newHash: mockIpfsHash,
    })
  })

  it('should commit with updated public profile', async () => {
    const testRegistry: any = createJolocomRegistry()

    const extendedDidDocumentJSON = {
      ...didDocumentJSON,
      service: [mockPubProfServiceEndpointJSON],
    }
    const extendedDidDocument = DidDocument.fromJSON(extendedDidDocumentJSON)
    const publicProfile = SignedCredential.fromJSON(publicProfileCredJSON)

    const localIdentity = Identity.fromDidDocument({
      didDocument: extendedDidDocument,
      publicProfile,
    })
    const remoteIdentity = Identity.fromDidDocument({
      didDocument: extendedDidDocument,
      publicProfile,
    })

    sandbox.stub(testRegistry, 'resolve').resolves(remoteIdentity)
    sandbox.stub(testRegistry.ipfsConnector, 'storeJSON').returns(mockIpfsHash)
    sandbox.stub(testRegistry.ethereumConnector, 'updateDIDRecord').returns()

    const identityWallet = new IdentityWallet({
      identity: localIdentity,
      vaultedKeyProvider: vault,
      publicKeyMetadata: {
        derivationPath: KeyTypes.jolocomIdentityKey,
        keyId: didDocumentJSON.publicKey[0].id,
      },
      contractsAdapter: jolocomContractsAdapter,
      contractsGateway: jolocomContractsGateway,
    })

    await testRegistry.commit({
      vaultedKeyProvider: vault,
      identityWallet,
      keyMetadata: { ...keyMetadata, derivationPath: KeyTypes.ethereumKey },
    })

    sandbox.assert.calledWith(testRegistry.resolve, mockDid)
    sandbox.assert.calledTwice(testRegistry.ipfsConnector.storeJSON)
    sandbox.assert.calledWith(testRegistry.ipfsConnector.storeJSON, {
      data: extendedDidDocumentJSON,
      pin: true,
    })
    sandbox.assert.calledWith(testRegistry.ipfsConnector.storeJSON, {
      data: publicProfileCredJSON,
      pin: true,
    })
    sandbox.assert.calledWith(testRegistry.ethereumConnector.updateDIDRecord, {
      did: mockDid,
      ethereumKey: testPrivateEthereumKey,
      newHash: mockIpfsHash,
    })
  })

  it('should commit with removed public profile', async () => {
    const testRegistry: any = createJolocomRegistry()

    const extendedDidDocumentJSON = {
      ...didDocumentJSON,
      service: [mockPubProfServiceEndpointJSON],
    }
    const extendedDidDocument = DidDocument.fromJSON(extendedDidDocumentJSON)
    const publicProfile = SignedCredential.fromJSON(publicProfileCredJSON)

    const localIdentity = Identity.fromDidDocument({
      didDocument: extendedDidDocument,
    })
    const remoteIdentity = Identity.fromDidDocument({
      didDocument: extendedDidDocument,
      publicProfile,
    })

    sandbox.stub(testRegistry, 'resolve').resolves(remoteIdentity)
    sandbox.stub(testRegistry.ipfsConnector, 'storeJSON').returns(mockIpfsHash)
    sandbox.stub(testRegistry.ethereumConnector, 'updateDIDRecord').returns()

    const identityWallet = new IdentityWallet({
      identity: localIdentity,
      vaultedKeyProvider: vault,
      publicKeyMetadata: {
        derivationPath: KeyTypes.jolocomIdentityKey,
        keyId: didDocumentJSON.publicKey[0].id,
      },
      contractsAdapter: jolocomContractsAdapter,
      contractsGateway: jolocomContractsGateway,
    })

    await testRegistry.commit({
      vaultedKeyProvider: vault,
      identityWallet,
      keyMetadata: { ...keyMetadata, derivationPath: KeyTypes.ethereumKey },
    })

    sandbox.assert.calledWith(testRegistry.resolve, mockDid)
    sandbox.assert.calledOnce(testRegistry.ipfsConnector.storeJSON)
    sandbox.assert.calledWith(testRegistry.ipfsConnector.storeJSON, {
      data: didDocumentJSON,
      pin: true,
    })
    sandbox.assert.calledWith(testRegistry.ethereumConnector.updateDIDRecord, {
      did: mockDid,
      ethereumKey: testPrivateEthereumKey,
      newHash: mockIpfsHash,
    })
  })

  it('should correctly throw', async () => {
    const testRegistry = createJolocomRegistry()

    const localIdentity = Identity.fromDidDocument({ didDocument })

    const identityWallet = new IdentityWallet({
      identity: localIdentity,
      vaultedKeyProvider: vault,
      publicKeyMetadata: {
        derivationPath: KeyTypes.jolocomIdentityKey,
        keyId: didDocumentJSON.publicKey[0].id,
      },
      contractsAdapter: jolocomContractsAdapter,
      contractsGateway: jolocomContractsGateway,
    })

    testRegistry.ipfsConnector.storeJSON = sinon
      .stub()
      .throws(new Error('Mock'))
    try {
      await testRegistry.commit({
        vaultedKeyProvider: vault,
        identityWallet,
        keyMetadata: {} as IKeyDerivationArgs,
      })
    } catch (err) {
      expect(err.message).to.contain(ErrorCodes.RegistryCommitFailed)
    }
  })
})
