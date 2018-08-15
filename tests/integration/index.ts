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
import { setTimeout } from 'timers';
import { IdentityWallet } from '../../ts/identityWallet/identityWallet';
import { ddoAttr } from '../data/identity';

chai.use(sinonChai)
const expect = chai.expect

describe('IdentityWallet', () => {
  let address
  let jolocomRegistry

  before(async function() {
    this.timeout(40000)
    address = await integrationHelper.init()

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
    jolocomRegistry = registries.jolocom.create({ ipfsConnector, ethereumConnector })
    const ddo = new DidDocument().fromPublicKey(testPublicIdentityKey)
    const identity = Identity.create({ didDocument: ddo.toJSON() })
  })

  describe('Creation of identity', () => {

    it('should generate a valid DDO', async () => {
      const a = 1

      const identityWallet: IdentityWallet = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey,
        privateEthereumKey: testPrivateEthereumKey
      })
      expect(identityWallet.getIdentity().didDocument).to.eq(ddoAttr)
    })

  })
})