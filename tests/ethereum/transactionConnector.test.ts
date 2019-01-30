import * as sinon from 'sinon'
import { expect } from 'chai'
import { EthereumTransactionConnector } from '../../ts/ethereum/transactionConnector'
import { mockEthTransactionCreationArgs, mockSerializedTX } from '../data/ethereum.data'

describe('EthereumTransactionConnector', () => {
  const sandbox = sinon.createSandbox()
  const mockEndp = 'http://mock.gateway.io'
  const ethTransactionConnector = new EthereumTransactionConnector(mockEndp)

  let stubCreateTransaction
  let stubSendSignedTX

  before(() => {
    stubCreateTransaction = sandbox.stub(EthereumTransactionConnector.prototype, 'createTransaction')
    stubSendSignedTX = sandbox.stub(EthereumTransactionConnector.prototype, 'sendSignedTransaction')
  })

  after(() => {
    sandbox.restore()
  })

  it('Should correctly call createTransaction', async () => {
    await ethTransactionConnector.createTransaction(mockEthTransactionCreationArgs)
    expect(stubCreateTransaction.getCall(0).args).to.deep.eq([mockEthTransactionCreationArgs])
  })

  it('Should attempt to send a signed transaction', async () => {
    await ethTransactionConnector.sendSignedTransaction(mockSerializedTX)
    expect(stubSendSignedTX.getCall(0).args).to.deep.eq([mockSerializedTX])
  })
})