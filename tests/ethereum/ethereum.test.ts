import * as sinon from 'sinon'
import { expect } from 'chai'
import { EthResolver } from '../../ts/ethereum/ethereum'
import EthereumResolver from 'jolocom-registry-contract'
import {
  mockIssuerDid,
  mockPubKey,
} from '../data/credential/signedCredential.data'
import { testPrivateKey } from '../data/keys.data'
import { testHash } from '../data/ipfs.data'

describe('EthResolver', () => {
  const sandbox = sinon.createSandbox()

  const mockAddr = '0000000000000000000000000000000000000000'
  const mockEndp = 'http://mock.gateway.io'

  let eth = new EthResolver({
    contractAddress: mockAddr,
    providerUrl: mockEndp,
  })

  let stubbedResolve
  let stubbedUpdate

  before(() => {
    stubbedResolve = sandbox.stub(EthereumResolver.prototype, 'resolveDID')
    stubbedUpdate = sandbox.stub(EthereumResolver.prototype, 'updateIdentity')
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
      ethereumKey: testPrivateKey,
      did: mockIssuerDid,
      owner: mockPubKey,
      newHash: testHash,
    })

    expect(stubbedUpdate.getCall(0).args).to.deep.eq([
      testPrivateKey,
      mockIssuerDid,
      '0x9166c289b9f905e55f9e3df9f69d7f356b4a22095f894f4715714aa4b56606aff181eb966be4acb5cff9e16b66d809be94e214f06c93fd091099af98499255e7',
      testHash,
    ])
  })
})
