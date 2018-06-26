import { IpfsStorageAgent } from '../ts/ipfs';
import { EthResolver } from '../ts/ethereum'
import { JolocomRegistry } from '../ts/registries/jolocomRegistry'
import testIdentity from './data/identity'
import { DidDocument } from '../ts/identity/didDocument'
import * as sinon from 'sinon'
import * as lolex from 'lolex'
import * as moment from 'moment'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../ts/identityWallet/identityWallet'
import { IDidDocumentAttrs } from '../ts/identity/didDocument/types'
import { testIpfsHash, testEthereumConfig, testIpfsConfig } from './data/registry'
import {
  testPrivateIdentityKey,
  testPrivateEthereumKey,
  testPublicIdentityKey
} from './data/keys'
chai.use(sinonChai)
const expect = chai.expect

describe('JolocomRegistry', () => {
  const sandbox = sinon.createSandbox()

  const unixEpoch = moment.utc('2018-01-24T15:42:15Z', moment.ISO_8601).valueOf()
  const clock = lolex.install({now: unixEpoch})

  const ipfsConnector = new IpfsStorageAgent(testIpfsConfig)
  const ethereumConnector = new EthResolver(testEthereumConfig)
  const ddo = new DidDocument().fromPublicKey(testPublicIdentityKey)
  const ddoAttrs = testIdentity.ddoAttrs
  const jolocomRegistry = JolocomRegistry.create({ipfsConnector, ethereumConnector})
  const identityWalletMock = new IdentityWallet()
  identityWalletMock.setDidDocument(ddo)
  identityWalletMock.setPrivateIdentityKey(testPrivateIdentityKey)

  describe('static created', () => {
    it('should create an instance of JolocomRegistry with correct config', () => {
      expect(jolocomRegistry.ipfsConnector).to.deep.equal(ipfsConnector)
      expect(jolocomRegistry.ethereumConnector).to.deep.equal(ethereumConnector)
    })
  })

  describe('instance create', () => {
    let identityWallet
    let commit

    beforeEach(async () => {
      sandbox.stub(IpfsStorageAgent.prototype, 'storeJSON')
        .withArgs({data: ddo, pin: true})
        .returns(testIpfsHash)
      sandbox.stub(EthResolver.prototype, 'updateDIDRecord')
        .withArgs({did: ddo.getDID(), ethereumKey: testPrivateEthereumKey, newHash: testIpfsHash})
        .resolves()

      commit = sandbox.spy(JolocomRegistry.prototype, 'commit')

      identityWallet = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey,
        privateEthereumKey: testPrivateEthereumKey
      })
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('should populate ddo on the identity wallet', () => {
      expect(identityWallet.getDidDocument()).to.deep.equal(ddo)
    })

    // TODO
    // it('should call commit method once with proper params', () => {
    //   commit.calledWith({wallet: identityWallet, privateEthereumKey: testPrivateEthereumKey})
    // })

    it('should return proper identityWallet instance on create', () => {
      expect(identityWallet).to.deep.equal(identityWalletMock)
    })
  })

  describe('commit', () => {
    let storeJSONStub
    let updateDIDRecordStub

    beforeEach(async () => {
      storeJSONStub = sandbox.stub(IpfsStorageAgent.prototype, 'storeJSON')
        .withArgs({data: ddo, pin: true})
        .returns(testIpfsHash)
      updateDIDRecordStub = sandbox.stub(EthResolver.prototype, 'updateDIDRecord')
        .withArgs({did: ddo.getDID(), ethereumKey: testPrivateEthereumKey, newHash: testIpfsHash})
        .resolves()
      await jolocomRegistry.commit({wallet: identityWalletMock, privateEthereumKey: testPrivateEthereumKey})
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should call storeJson on IpfsStorageAgent', () => {
      sandbox.assert.calledOnce(storeJSONStub)
    })

    it('should call updateDIDRecord on EthResolver', () => {
      sandbox.assert.calledOnce(updateDIDRecordStub)
    })
  })

  describe('resolve', () => {
    let resolveDIDStub
    let catJSONStub

    beforeEach(async () => {
      resolveDIDStub = sandbox.stub(EthResolver.prototype, 'resolveDID')
        .withArgs(ddo.getDID())
        .resolves(testIpfsHash)
      catJSONStub = sandbox.stub(IpfsStorageAgent.prototype, 'catJSON')
        .withArgs(testIpfsHash)
        .resolves(ddoAttrs)
      await jolocomRegistry.resolve(ddo.getDID())
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should fetch ipfsHash from Ethereum', () => {
      sandbox.assert.calledOnce(resolveDIDStub)
    })

    it('should fetch DDO attributes from IPFS', () => {
      sandbox.assert.calledOnce(catJSONStub)
    })
  })

  describe('authenticate', () => {
    let resolveStub
    let identityWallet

    beforeEach(async () => {
      resolveStub = sandbox.stub(JolocomRegistry.prototype, 'resolve')
        .withArgs(ddo.getDID())
        .resolves(ddoAttrs)
      identityWallet = await jolocomRegistry.authenticate(testPrivateIdentityKey)
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should resolve DID to DDO attributes', () => {
      sandbox.assert.calledOnce(resolveStub)
    })
    // TODO: adjust when identityWallet is implemented
    // it('should return proper identityWallet instance on create', () => {
    //   expect(identityWallet).to.deep.equal(identityWalletMock)
    // })
  })

  describe('error handling commit', () => {
    let storeJSONStub
    let updateDIDRecordStub
    afterEach(() => {
      sandbox.restore()
    })

    it('should correctly assemble the thrown error message on storeJSON', async () => {
      storeJSONStub = sandbox.stub(IpfsStorageAgent.prototype, 'storeJSON')
      .withArgs({data: ddo, pin: true})
      .throws(new Error('Incorrect data submitted'))

      try {
        await jolocomRegistry.commit({wallet: identityWalletMock, privateEthereumKey: testPrivateEthereumKey})
      } catch (err) {
        expect(err.message).to.equal(`Could not save DID record on IPFS. Incorrect data submitted`)
      }
    })

    it('should correctly assemble the thrown error message on updateDIDRecord', async () => {
      storeJSONStub = sandbox.stub(IpfsStorageAgent.prototype, 'storeJSON')
        .withArgs({data: ddo, pin: true})
        .returns(testIpfsHash)

      updateDIDRecordStub = sandbox.stub(EthResolver.prototype, 'updateDIDRecord')
        .withArgs( {ethereumKey: testPrivateEthereumKey, did: ddo.getDID(), newHash: testIpfsHash})
        .throws(new Error('Connection failed.'))

      try {
        await jolocomRegistry.commit({wallet: identityWalletMock, privateEthereumKey: testPrivateEthereumKey})
      } catch (err) {
        expect(err.message).to.equal(`Could not register DID record on Ethereum. Connection failed.`)
      }
    })
  })

  describe('error handling resolve', () => {
    let resolveDIDStub
    let catJSONStub
    afterEach(() => {
      sandbox.restore()
    })

    it('should correctly assemble the thrown error on failed resolveDID', async () => {
      resolveDIDStub = sandbox.stub(EthResolver.prototype, 'resolveDID')
        .throws(new Error('DID not existing.'))
      try {
        await jolocomRegistry.resolve({did: ddo.getDID()})
      } catch (err) {
        expect(err.message).to.equal(`Could not retrieve DID Document. DID not existing.`)
      }
    })

    it('should correctly assemble the thrown error on failed catJSNO', async () => {
      resolveDIDStub = sandbox.stub(EthResolver.prototype, 'resolveDID')
        .returns(ddo.getDID)
      catJSONStub = sandbox.stub(IpfsStorageAgent.prototype, 'catJSON')
        .throws(new Error('No DDO.'))
      try {
        await jolocomRegistry.resolve({did: ddo.getDID()})
      } catch (err) {
        expect(err.message).to.equal(`Could not retrieve DID Document. No DDO.`)
      }
    })
  })
})
