import * as sinon from 'sinon'
import * as chai from 'chai'
import * as sinonChai from 'sinon-chai'
import { IpfsStorageAgent, jolocomIpfsStorageAgent } from '../../ts/ipfs/ipfs'
import { EthResolver, jolocomEthereumResolver } from '../../ts/ethereum/ethereum'
import { JolocomRegistry, createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { testEthereumConfig, testIpfsConfig } from '../data/registry.data'
import {jolocomContractHandler} from '../../ts/contracts/contracts'
import {jolocomContractsGateway} from '../../ts/contracts/contractsGateway'

chai.use(sinonChai)
const expect = chai.expect

describe('JolocomRegistry', () => {
  let sandbox = sinon.createSandbox()
  let jolocomRegistry: JolocomRegistry

  afterEach(() => {
    sandbox.reset()
  })

  describe('Jolocom Registry - static create', () => {
    const ipfsConnector = new IpfsStorageAgent(testIpfsConfig)
    const ethereumConnector = new EthResolver(testEthereumConfig)
    jolocomRegistry = createJolocomRegistry({ ipfsConnector, ethereumConnector, contracts: {
      implementation: jolocomContractHandler,
      connection: jolocomContractsGateway
    } })

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
})
