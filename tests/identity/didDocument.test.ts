import * as chai from 'chai'
import * as sinon from 'sinon'
import * as crypto from 'crypto'
import * as jsonld from 'jsonld'
import { testPublicIdentityKey } from '../data/keys.data'
import {
  didDocumentJSON,
  mockDid,
  mockKeyId,
  normalizedDidDocument,
} from '../data/didDocument.data'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { IDidDocumentAttrs } from '../../ts/identity/didDocument/types'
const expect = chai.expect

describe('DidDocument', () => {
  const sandbox = sinon.createSandbox()

  let referenceDidDocument = DidDocument.fromPublicKey(testPublicIdentityKey)
  let clock

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox.stub(jsonld, 'canonize').returns(normalizedDidDocument)
    sandbox
      .stub(crypto, 'randomBytes')
      .returns(Buffer.from('1842fb5f567dd532', 'hex'))
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

  it('Should correctly implement normalize', async () => {
    await referenceDidDocument.digest()

    const excludingProof = { ...didDocumentJSON } as IDidDocumentAttrs
    delete excludingProof.proof

    sandbox.assert.calledWith(jsonld.canonize, excludingProof)
  })

  it('implements getters', () => {
    /* Makes later comparisons simpler */
    const {
      authentication,
      proof,
      publicKey,
      id,
      service,
      created,
    } = didDocumentJSON
    const auth = referenceDidDocument.authentication
    const pub = referenceDidDocument.publicKey.map(pub => pub.toJSON())
    const serv = referenceDidDocument.service.map(ser => ser.toJSON())

    expect(auth).to.deep.eq(authentication)
    expect(pub).to.deep.eq(publicKey)
    expect(serv).to.deep.eq(service)
    expect(referenceDidDocument.context).to.deep.eq(didDocumentJSON['@context'])
    expect(referenceDidDocument.did).to.deep.eq(id)
    expect(referenceDidDocument.created.toISOString()).to.deep.eq(created)
    expect(referenceDidDocument.proof.toJSON()).to.deep.eq(proof)
    expect(referenceDidDocument.signature).to.deep.eq(proof.signatureValue)
    expect(referenceDidDocument.signer).to.deep.eq({
      did: mockDid,
      keyId: mockKeyId,
    })
  })
})
