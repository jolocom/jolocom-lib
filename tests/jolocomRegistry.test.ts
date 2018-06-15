import { IpfsStorageAgent } from '../ts/ipfs';
import { EthResolver } from '../ts/ethereum'
import { JolocomRegistry } from '../ts/registries/jolocomRegistry'
import { ECPair } from 'bitcoinjs-lib'
import testKeys from './data/keys'
import { DidDocument } from '../ts/identity/didDocument'
import * as sinon from 'sinon'
import * as lolex from 'lolex'
import * as moment from 'moment'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { IdentityWallet } from '../ts/identityWallet/identityWallet';
chai.use(sinonChai)
const expect = chai.expect

describe.only('JolocomRegistry', () => {
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
  const ipfsHash = '4f72333148622e4ae56e9c65d57aee47186cd6910ca080757ab72cc0c650f6bb'

  sinon.stub(IpfsStorageAgent.prototype, 'storeJSON')
    .withArgs({data: ddo, pin: true})
    .returns(ipfsHash)
  sinon.stub(EthResolver.prototype, 'updateDIDRecord')
    .withArgs({did: ddo.getDID(), ethereumKey: testPrivateEthereumKey, newHash: ipfsHash})
    .resolves()

  const jolocomRegistry = JolocomRegistry.create({ipfsConnector, ethereumConnector})

  describe('static create method', () => {
    it('should create an instance of JolocomRegistry with correct config', () => {
      expect(jolocomRegistry.ipfsConnector).to.deep.equal(ipfsConnector)
      expect(jolocomRegistry.ethereumConnector).to.deep.equal(ethereumConnector)
    })
  })

  describe('create instance method', async () => {
    const identityWallet = await jolocomRegistry.create({
      privateIdentityKey: testPrivateIdentityKey,
      privateEthereumKey: testPrivateEthereumKey
    })

    it('should populate ddo on the identity wallet', () => {
      expect(identityWallet.getDidDocument()).to.deep.equal(ddo)
    })

    it('should call commit method once with proper params', async () => {
      const commit = sinon.spy(JolocomRegistry.prototype, 'commit')
      commit.calledWith({wallet: identityWallet, privateEthereumKey: testPrivateEthereumKey})
    })

    it('should return proper identityWallet instance on create', () => {
      const identityWalletMock = new IdentityWallet()
      identityWalletMock.setDidDocument({didDocument: ddo})
      identityWalletMock.setPrivateIdentityKey({privateIdentityKey: testPrivateIdentityKey})
      expect(identityWallet).to.deep.equal(identityWalletMock)
    })
  })
})
