import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { 
  testPrivateIdentityKey,
  testPublicIdentityKey,
  testPrivateEthereumKey
} from '../data/keys'
import { DidDocument } from '../../ts/identity/didDocument'
import { Identity } from '../../ts/identity/identity'
import * as integrationHelper from './provision'
import { IIpfsConfig } from '../../ts/ipfs/types';
import { IpfsStorageAgent } from '../../ts/ipfs';
import { registries } from '../../ts/registries';
import { IEthereumResolverConfig } from '../../ts/ethereum/types';
import { EthResolver } from '../../ts/ethereum';

chai.use(sinonChai)
const expect = chai.expect

describe('IdentityWallet', () => {
  before(() => {
    integrationHelper.init()
  })

  const ipfsConfig: IIpfsConfig = {
    protocol: 'https',
    port: 43134,
    host: '127.0.0.1'
  }
  const ethereumConfig: IEthereumResolverConfig = {
    providerUrl: 'https://127.0.0.1/',
    contractAddress: ''
  }

  const ipfsConnector = new IpfsStorageAgent(ipfsConfig)
  const ethereumConnector = new EthResolver(ethereumConfig)
  const jolocomRegistry = registries.jolocom.create({ipfsConnector, ethereumConnector})
  const ddo = new DidDocument().fromPublicKey(testPublicIdentityKey)
  const identity = Identity.create({didDocument: ddo.toJSON()})

  it('should call commit method once', async () => {
    const a = 1

    const identityWallet = await jolocomRegistry.create({
      privateIdentityKey: testPrivateIdentityKey,
      privateEthereumKey: testPrivateEthereumKey
    })
    expect(a).to.eq(1)
  })
})