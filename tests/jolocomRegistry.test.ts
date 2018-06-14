import { expect } from 'chai';
import { IpfsStorageAgent } from '../ts/ipfs';
import { EthResolver } from '../ts/ethereum'
import { JolocomRegistry } from '../ts/registries/jolocomRegistry'

describe('JolocomRegistry', () => {
  const ipfsConnector = new IpfsStorageAgent({config: {
    host: 'test',
    port: 9090,
    protocol: 'testprotocol'
  }})

  const ethereumConnector = new EthResolver({config: {
    providerUrl: 'testEthereumURL',
    contractAddress: '0xtesttest777'
  }})

  const jolocomRegistry = JolocomRegistry.create({ipfsConnector, ethereumConnector})

  describe('static create method', () => {
    it('should create an instance of JolocomRegistry with correct config', () => {
      expect(jolocomRegistry.ipfsConnector).to.deep.equal(ipfsConnector)
      expect(jolocomRegistry.ethereumConnector).to.deep.equal(ethereumConnector)
    })
  })

  describe('create instance method', () => {
    it('should call commit method once with proper params', () => {
      // TODO
    })
  })
})
