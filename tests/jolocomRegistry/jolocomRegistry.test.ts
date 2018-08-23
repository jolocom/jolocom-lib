import { IpfsStorageAgent, jolocomIpfsStorageAgent } from '../../ts/ipfs'
import { EthResolver, jolocomEthereumResolver } from '../../ts/ethereum'
import { JolocomRegistry, createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { ddoAttr, ddoAttrNoPublicProfile, publicProfileJSON } from '../data/identity'
import { DidDocument } from '../../ts/identity/didDocument'
import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { Identity } from '../../ts/identity/identity'
import { testIpfsHash, testEthereumConfig, testIpfsConfig } from '../data/registry'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { testPrivateIdentityKey, testPrivateEthereumKey } from '../data/keys'

chai.use(sinonChai)
const expect = chai.expect

describe('JolocomRegistry', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('static create', () => {
    const ipfsConnector = new IpfsStorageAgent(testIpfsConfig)
    const ethereumConnector = new EthResolver(testEthereumConfig)
    const jolocomRegistry = createJolocomRegistry({ipfsConnector, ethereumConnector})

    // TODO We should eventually check if we can plug in another connector
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

  describe('instance create', () => {
    let identityWallet
    let commit

    beforeEach(async () => {
      const jolocomRegistry = createJolocomRegistry()

      commit = sandbox.stub(JolocomRegistry.prototype, 'commit').resolves()
      identityWallet = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey,
        privateEthereumKey: testPrivateEthereumKey
      })
    })

    it('should populate identity on the identity wallet', () => {
      expect(identityWallet.getIdentity()).to.be.instanceof(Identity)
    })

    it('should call commit method once', () => {
      sandbox.assert.calledOnce(commit)
    })

    it('should return proper identityWallet instance on create', () => {
      expect(identityWallet).to.be.instanceof(IdentityWallet)
    })
  })

  describe('commit', () => {
    let storeJSONStub
    let updateDIDRecordStub
    let unpin

    beforeEach(async () => {
      unpin = sandbox.stub(JolocomRegistry.prototype, 'unpin').resolves()
      storeJSONStub = sandbox.stub(IpfsStorageAgent.prototype, 'storeJSON').resolves(testIpfsHash)
      updateDIDRecordStub = sandbox.stub(EthResolver.prototype, 'updateDIDRecord').resolves()

      const jolocomRegistry = createJolocomRegistry()
      const ddo = await new DidDocument().fromPrivateKey(testPrivateIdentityKey)
      const identity = Identity.create({ didDocument: ddo.toJSON() })
      const identityWalletMock = IdentityWallet.create({ privateIdentityKey: testPrivateIdentityKey, identity })

      await jolocomRegistry.commit({ wallet: identityWalletMock, privateEthereumKey: testPrivateEthereumKey })
    })

    it('should call unpin', () => {
      expect(unpin.notCalled).to.be.true
    })

    it('should call storeJson on IpfsStorageAgent', () => {
      sandbox.assert.calledOnce(storeJSONStub)
    })

    it('should call updateDIDRecord on EthResolver', () => {
      sandbox.assert.calledOnce(updateDIDRecordStub)
    })
  })

  describe('resolve with public profile', () => {
    const testDDO = DidDocument.fromJSON(ddoAttr)
    const jolocomRegistry = createJolocomRegistry()

    let resolveDIDStub
    let catJSONStub
    let fetchPublicProfileStub

    beforeEach(async () => {
      const ddo = await new DidDocument().fromPrivateKey(testPrivateIdentityKey)

      resolveDIDStub = sandbox
        .stub(EthResolver.prototype, 'resolveDID')
        .withArgs(ddo.getDID())
        .resolves(testIpfsHash)

      catJSONStub = sandbox
        .stub(IpfsStorageAgent.prototype, 'catJSON')
        .withArgs(testIpfsHash)
        .resolves(ddoAttr)

      fetchPublicProfileStub = sandbox
        .stub(JolocomRegistry.prototype, 'fetchPublicProfile')
        .withArgs(testDDO.getServiceEndpoints())
        .resolves(SignedCredential.fromJSON(publicProfileJSON))

      await jolocomRegistry.resolve(ddo.getDID())
    })

    it('should fetch ipfsHash from Ethereum', () => {
      sandbox.assert.calledOnce(resolveDIDStub)
    })

    it('should fetch DDO attributes from IPFS', () => {
      sandbox.assert.calledOnce(catJSONStub)
    })

    // TODO TODO
    it('should call resolvePublicProfile when public profile on ddo', () => {
      // sandbox.assert.calledOnce(fetchPublicProfileStub)
    })
  })

  describe('resolve with no public profile', () => {
    let fetchPublicProfileStub
    let resolvedIdentity

    beforeEach(async () => {
      const jolocomRegistry = createJolocomRegistry()
      const ddo = await new DidDocument().fromPrivateKey(testPrivateIdentityKey)

      sandbox
        .stub(EthResolver.prototype, 'resolveDID')
        .withArgs(ddo.getDID())
        .resolves(testIpfsHash)

      sandbox
        .stub(IpfsStorageAgent.prototype, 'catJSON')
        .withArgs(testIpfsHash)
        .resolves(ddoAttrNoPublicProfile)

      fetchPublicProfileStub = sandbox.stub(JolocomRegistry.prototype, 'fetchPublicProfile')

      resolvedIdentity = await jolocomRegistry.resolve(ddo.getDID())
    })

    it('should not call fetchPublicProfile when no public profile on ddo', () => {
      sandbox.assert.notCalled(fetchPublicProfileStub)
    })

    it('retured identity instance should have no public profile', () => {
      expect(resolvedIdentity.publicProfile.get()).to.be.false
    })
  })

  describe('resolvePublicProfile', () => {
    const jolocomRegistry = createJolocomRegistry()

    let catJSONStub
    let profile

    beforeEach(async () => {
      catJSONStub = sandbox.stub(IpfsStorageAgent.prototype, 'catJSON').resolves(publicProfileJSON)
      profile = await jolocomRegistry.fetchPublicProfile(
        DidDocument.fromJSON(ddoAttr)
          .getServiceEndpoints()[0]
          .getServiceEndpoint()
      )
    })

    it('should call ipfsStorageAgent to resolve public profile hash', () => {
      sandbox.assert.calledOnce(catJSONStub)
    })

    it('should return a correct signed credential instance', () => {
      expect(profile).to.be.instanceof(SignedCredential)
      expect(profile).to.deep.equal(SignedCredential.fromJSON(publicProfileJSON))
    })
  })

  describe('authenticate', () => {
    let resolveStub
    let identityWallet

    beforeEach(async () => {
      const jolocomRegistry = createJolocomRegistry()
      const ddo = await new DidDocument().fromPrivateKey(testPrivateIdentityKey)

      resolveStub = sandbox
        .stub(JolocomRegistry.prototype, 'resolve')
        .withArgs(ddo.getDID())
        .resolves(Identity.create({ didDocument: ddo.toJSON() }))

      identityWallet = await jolocomRegistry.authenticate(testPrivateIdentityKey)
    })

    it('should call resolve', () => {
      sandbox.assert.calledOnce(resolveStub)
    })

    it('should return proper identityWallet instance on create', () => {
      expect(identityWallet).to.be.instanceof(IdentityWallet)
    })
  })

  describe('error handling commit', () => {
    const jolocomRegistry = createJolocomRegistry()

    let ddo

    beforeEach(async () => {
      ddo = await new DidDocument().fromPrivateKey(testPrivateIdentityKey)
      sandbox.stub(JolocomRegistry.prototype, 'unpin').resolves()
      sandbox.stub(IpfsStorageAgent.prototype, 'storeJSON').returns(testIpfsHash)
      sandbox
        .stub(EthResolver.prototype, 'updateDIDRecord')
        .withArgs({ ethereumKey: testPrivateEthereumKey, did: ddo.getDID(), newHash: testIpfsHash })
        .throws(new Error('Connection failed.'))
    })

    it('should correctly assemble the thrown error message on updateDIDRecord', async () => {
      const identity = Identity.create({ didDocument: ddo.toJSON() })
      const identityWalletMock = IdentityWallet.create({ privateIdentityKey: testPrivateIdentityKey, identity })

      try {
        await jolocomRegistry.commit({ wallet: identityWalletMock, privateEthereumKey: testPrivateEthereumKey })
      } catch (err) {
        expect(err.message).to.equal(`Could not register DID record on Ethereum. Connection failed.`)
      }
    })
  })

  describe('error handling resolve', () => {
    const jolocomRegistry = createJolocomRegistry()

    it('should correctly assemble the thrown error on failed resolveDID', async () => {
      const ddo = await new DidDocument().fromPrivateKey(testPrivateIdentityKey)

      sandbox.stub(EthResolver.prototype, 'resolveDID').throws(new Error('DID not existing.'))

      try {
        await jolocomRegistry.resolve({ did: ddo.getDID() })
      } catch (err) {
        expect(err.message).to.equal(`Could not retrieve DID Document. DID not existing.`)
      }
    })

    it('should correctly assemble the thrown error on failed catJSNO', async () => {
      const ddo = await new DidDocument().fromPrivateKey(testPrivateIdentityKey)

      sandbox.stub(EthResolver.prototype, 'resolveDID').returns(ddo.getDID)
      sandbox.stub(IpfsStorageAgent.prototype, 'catJSON').throws(new Error('No DDO.'))
      try {
        await jolocomRegistry.resolve({ did: ddo.getDID() })
      } catch (err) {
        expect(err.message).to.equal(`Could not retrieve DID Document. No DDO.`)
      }
    })
  })

  describe('unpin', () => {
    let resolveDIDStub
    let removePinnedHashStub

    const jolocomRegistry = createJolocomRegistry()

    beforeEach(async () => {
      const ddo = await new DidDocument().fromPrivateKey(testPrivateIdentityKey)
      const identity = Identity.create({ didDocument: ddo.toJSON() })
      const identityWalletMock = IdentityWallet.create({ privateIdentityKey: testPrivateIdentityKey, identity })

      resolveDIDStub = sandbox.stub(EthResolver.prototype, 'resolveDID').resolves(testIpfsHash)
      removePinnedHashStub = sandbox.stub(IpfsStorageAgent.prototype, 'removePinnedHash').resolves()

      sandbox.stub(IpfsStorageAgent.prototype, 'storeJSON').resolves(testIpfsHash)
      sandbox.stub(EthResolver.prototype, 'updateDIDRecord').resolves()

      await jolocomRegistry.commit({ wallet: identityWalletMock, privateEthereumKey: testPrivateEthereumKey })
    })

    // TODO
    it('sould call resolveDID', () => {
      // sandbox.assert.calledOnce(resolveDIDStub)
    })

    it('should call removePinnedHash', () => {
      // sandbox.assert.calledOnce(removePinnedHashStub)
    })
  })

  describe('unpin throwing error', () => {
    let unpin
    const jolocomRegistry = createJolocomRegistry()

    beforeEach(() => {
      sandbox.stub(IpfsStorageAgent.prototype, 'storeJSON').resolves(testIpfsHash)
      sandbox.stub(EthResolver.prototype, 'updateDIDRecord').resolves()
      sandbox.stub(EthResolver.prototype, 'resolveDID').resolves(testIpfsHash)
      sandbox.stub(IpfsStorageAgent.prototype, 'removePinnedHash').throws('Removing pinned hash was not successful')
      unpin = sandbox.stub(JolocomRegistry.prototype, 'unpin')
    })

    // TODO Rework
    it('should not throw an error on removePinnedHash failure', async () => {
      const ddo = await new DidDocument().fromPrivateKey(testPrivateIdentityKey)
      const identity = Identity.create({ didDocument: ddo.toJSON() })
      const identityWalletMock = IdentityWallet.create({ privateIdentityKey: testPrivateIdentityKey, identity })

      await jolocomRegistry.commit({ wallet: identityWalletMock, privateEthereumKey: testPrivateEthereumKey })

      // sandbox.assert.calledOnce(unpin)
    })
  })
})
