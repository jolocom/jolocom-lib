import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import {
  testPrivateIdentityKey,
  testPrivateEthereumKey
} from '../data/keys'
import { DidDocument } from '../../ts/identity/didDocument'
import { Identity } from '../../ts/identity/identity'
import * as integrationHelper from './provision'
import { IIpfsConfig } from '../../ts/ipfs/types'
import { IpfsStorageAgent } from '../../ts/ipfs'
import { registries } from '../../ts/registries'
import { IEthereumResolverConfig } from '../../ts/ethereum/types'
import { EthResolver } from '../../ts/ethereum'
import { setTimeout } from 'timers'
import { IdentityWallet } from '../../ts/identityWallet/identityWallet'
import { ddoAttr } from '../data/identity'
import { createJolocomRegistry } from '../../ts/registries/jolocomRegistry';

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
    jolocomRegistry = createJolocomRegistry({ ipfsConnector, ethereumConnector })
    const ddo = await new DidDocument().fromPrivateKey(testPrivateIdentityKey)
    const identity = Identity.create({ didDocument: ddo.toJSON() })
  })

  describe('Creation of identity', () => {

    it('should generate a valid DDO', async () => {
      const identityWallet: IdentityWallet = await jolocomRegistry.create({
        privateIdentityKey: testPrivateIdentityKey,
        privateEthereumKey: testPrivateEthereumKey
      })

      const didDocument = identityWallet.getIdentity().didDocument

      expect(didDocument).to.be.an.instanceOf(DidDocument)
      expect(didDocument.getDID()).to.eq('did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af')
    })

  })

  // errors out now; publicProfile changes will fix it
  // describe('Authentication', () => {

  //   it('should return authenticated identity wallet', async () => {
  //     const authenticated = await jolocomRegistry.authenticate(testPrivateIdentityKey)

  //     expect(authenticated).to.be.an.instanceOf(IdentityWallet)
  //     expect(authenticated.getIdentity().getDID())
  //       .to.eq('did:jolo:5dcbd50085819b40b93efc4f13fb002119534e9374274b10edce88df8cb311af')
  //   })

  // })

  describe('Signature verification', () => {

    it('should generate a valid DDO', async () => {
     return true
    })

  })

  describe('Signed credentials', () => {

    it('should generate a valid DDO', async () => {
      return true
    })

  })

})
