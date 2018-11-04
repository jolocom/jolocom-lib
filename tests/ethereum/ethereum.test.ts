import * as sinon from 'sinon'
import { expect } from 'chai'
import { EthResolver } from '../../ts/ethereum/ethereum'
import EthereumResolver from 'jolocom-registry-contract'
import { mockIssuerDid } from '../data/credential/signedCredential.data'
import { testPrivateEthereumKey } from '../data/keys.data'
import { testHash } from '../data/ipfs.data'

describe('EthResolver', () => {
  const sandbox = sinon.createSandbox()

  const mockAddr = '0000000000000000000000000000000000000000'
  const mockEndp = 'http://mock.gateway.io'

  let eth = new EthResolver({
    contractAddress: mockAddr,
    providerUrl: mockEndp
  })

  let stubbedResolve
  let stubbedUpdate

  before(() => {
    stubbedResolve = sandbox.stub(EthereumResolver.prototype, 'resolveDID')
    stubbedUpdate = sandbox.stub(EthereumResolver.prototype, 'updateDIDRecord')
  })

  after(() => {
    sandbox.restore()
  })

  it('Should attempt to resolve did', () => {
    eth.resolveDID(mockIssuerDid)
    expect(stubbedResolve.getCall(0).args).to.deep.eq([mockIssuerDid])
  })

  it('Should attempt to update did record', () => {
    eth.updateDIDRecord({
      ethereumKey: testPrivateEthereumKey,
      did: mockIssuerDid,
      newHash: testHash
    })

    expect(stubbedUpdate.getCall(0).args).to.deep.eq([testPrivateEthereumKey, mockIssuerDid, testHash])
  })
})