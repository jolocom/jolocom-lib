import { IpfsStorageAgent } from '../ts/ipfs';
import { EthResolver } from '../ts/ethereum'
import { JolocomRegistry } from '../ts/registries/jolocomRegistry'
import { ECPair } from 'bitcoinjs-lib'
import testKeys from './data/keys'
import testIdentity from './data/identity'
import { DidDocument } from '../ts/identity/didDocument'
import * as sinon from 'sinon'
import * as lolex from 'lolex'
import * as moment from 'moment'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../ts/identityWallet/identityWallet'
import { IDidDocumentAttrs } from '../ts/identity/didDocument/types'

chai.use(sinonChai)
const expect = chai.expect

describe.only('JolocomRegistry', () => {
  const sandbox = sinon.createSandbox()

  const ipfsConnector = new IpfsStorageAgent({config: {
    host: 'test',
    port: 9090,
    protocol: 'testprotocol'
  }})

  const ethereumConnector = new EthResolver({config: {
    providerUrl: 'testEthereumURL',
    contractAddress: '0x8389B5a24a1c56aFAD7309EF3b8e04bBadC935c4'
  }})

  const unixEpoch = moment.utc('2018-01-24T15:42:15Z', moment.ISO_8601).valueOf()
  const clock = lolex.install({now: unixEpoch})

  const keyPairSigning = ECPair.fromWIF(testKeys.testGenericKeyPairWIF)
  const keyPairEthereum = ECPair.fromWIF(testKeys.testEthereumKeyPairWIF)
  const testPrivateIdentityKey = keyPairSigning.d.toBuffer(32)
  const testPrivateEthereumKey = keyPairEthereum.d.toBuffer(32)

  const ddo = new DidDocument().fromPublicKey(keyPairSigning.getPublicKeyBuffer())
  const ddoAttrs: IDidDocumentAttrs = testIdentity.ddoAttrs
  const ipfsHash = '4f72333148622e4ae56e9c65d57aee47186cd6910ca080757ab72cc0c650f6bb'

  const jolocomRegistry = JolocomRegistry.create({ipfsConnector, ethereumConnector})

  const identityWalletMock = new IdentityWallet()
  identityWalletMock.setDidDocument({didDocument: ddo})
  identityWalletMock.setPrivateIdentityKey({privateIdentityKey: testPrivateIdentityKey})

  describe('static created', () => {
    it('should create an instance of JolocomRegistry with correct config', () => {
      expect(jolocomRegistry.ipfsConnector).to.deep.equal(ipfsConnector)
      expect(jolocomRegistry.ethereumConnector).to.deep.equal(ethereumConnector)
    })
  })

  describe('instance create', async () => {
    let identityWallet

    beforeEach(async () => {
      sandbox.stub(IpfsStorageAgent.prototype, 'storeJSON')
        .withArgs({data: ddo, pin: true})
        .returns(ipfsHash)
      sandbox.stub(EthResolver.prototype, 'updateDIDRecord')
        .withArgs({did: ddo.getDID(), ethereumKey: testPrivateEthereumKey, newHash: ipfsHash})
        .resolves()

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

    it('should call commit method once with proper params', async () => {
      const commit = sinon.spy(JolocomRegistry.prototype, 'commit')
      commit.calledWith({wallet: identityWallet, privateEthereumKey: testPrivateEthereumKey})
    })

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
        .returns(ipfsHash)
      updateDIDRecordStub = sandbox.stub(EthResolver.prototype, 'updateDIDRecord')
        .withArgs({did: ddo.getDID(), ethereumKey: testPrivateEthereumKey, newHash: ipfsHash})
        .resolves()
      await jolocomRegistry.commit({wallet: identityWalletMock, privateEthereumKey: testPrivateEthereumKey})
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should call storeJson on IpfsStorageAgent', async () => {
      sandbox.assert.calledOnce(storeJSONStub)
    })

    it('should call updateDIDRecord on EthResolver', async () => {
      sandbox.assert.calledOnce(updateDIDRecordStub)
    })
  })

  describe('resolve', () => {
    let resolveDIDStub
    let catJSONStub

    beforeEach(async () => {
      resolveDIDStub = sandbox.stub(EthResolver.prototype, 'resolveDID')
        .withArgs({did: ddo.getDID()})
        .resolves(ipfsHash)
      catJSONStub = sandbox.stub(IpfsStorageAgent.prototype, 'catJSON')
        .withArgs({hash: ipfsHash})
        .resolves(ddoAttrs)
      await jolocomRegistry.resolve({did: ddo.getDID()})
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
        .withArgs({did: ddo.getDID()})
        .resolves(ddoAttrs)
      identityWallet = await jolocomRegistry.authenticate({privateIdentityKey: testPrivateIdentityKey})
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should resolve DID to DDO attributes', () => {
      sandbox.assert.calledOnce(resolveStub)
    })

    it('should return proper identityWallet instance on create', () => {
      expect(identityWallet).to.deep.equal(identityWalletMock)
    })
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
        .returns(ipfsHash)

      updateDIDRecordStub = sandbox.stub(EthResolver.prototype, 'updateDIDRecord')
        .withArgs( {ethereumKey: testPrivateEthereumKey, did: ddo.getDID(), newHash: ipfsHash})
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
