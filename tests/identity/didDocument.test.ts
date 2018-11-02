import * as chai from 'chai'
import * as sinon from 'sinon'
import * as crypto from 'crypto'
import { DidDocument } from '../../ts/identity/didDocument'
import { testPublicIdentityKey } from '../data/keys'
import { didDocumentJSON, mockDid, mockKeyId } from '../data/didDocument'
const expect = chai.expect

describe('DidDocument', () => {
  const sandbox = sinon.createSandbox()

  let referenceDidDocument = DidDocument.fromPublicKey(testPublicIdentityKey)
  let clock

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox.stub(crypto, 'randomBytes').returns(Buffer.from('1842fb5f567dd532', 'hex'))
  })

  beforeEach(() => {
    referenceDidDocument = DidDocument.fromPublicKey(testPublicIdentityKey)
  })

  after(() => {
    sandbox.restore()
    clock.restore()
  })

  it('Should correctly implement fromJSON', () => {
    const didDocFromJSON = DidDocument.fromJSON(didDocumentJSON)
    expect(referenceDidDocument).to.deep.eq(didDocFromJSON)
  })

  it('Should correctly implement toJSON', () => {
    expect(referenceDidDocument.toJSON()).to.deep.eq(didDocumentJSON)
  })

  it('Non trivial getters should work', () => {
    expect(referenceDidDocument.getSigner()).to.deep.eq({
      did: mockDid,
      keyId: mockKeyId
    })
  })
})
