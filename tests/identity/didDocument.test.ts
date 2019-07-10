import * as chai from 'chai'
import * as sinon from 'sinon'
import * as crypto from 'crypto'
import * as jsonld from 'jsonld'
import { testPublicKey } from '../data/keys.data'
import {
  didDocumentJSON,
  didDocumentWithProofJSON,
  mockDid,
  mockKeyId,
  normalizedDidDocument,
} from '../data/didDocument.data'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { IDidDocumentAttrs } from '../../ts/identity/didDocument/types'
const expect = chai.expect

describe('DidDocument', () => {
  const sandbox = sinon.createSandbox()

  let referenceDidDocument = DidDocument.fromPublicKey(testPublicKey)
  let clock

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox.stub(jsonld, 'canonize').returns(normalizedDidDocument)
    sandbox
      .stub(crypto, 'randomBytes')
      .returns(Buffer.from('1842fb5f567dd532', 'hex'))
  })

  beforeEach(() => {
    referenceDidDocument = DidDocument.fromPublicKey(testPublicKey)
    referenceDidDocument.created = new Date()
  })

  after(() => {
    sandbox.restore()
    clock.restore()
  })

  it('Should correctly implement fromJSON', async () => {
    let didDocFromJSON = DidDocument.fromJSON(didDocumentJSON)
    // @ts-ignore
    referenceDidDocument._proof = undefined
    expect(didDocFromJSON).to.deep.eq(referenceDidDocument)
  })

  // TODO test signatures and signature validation

  it('Should correctly implement toJSON', () => {
    expect(referenceDidDocument.toJSON()).to.deep.eq(didDocumentJSON)
  })

  it('Should correctly implement normalize', async () => {
    await referenceDidDocument.prepareSignature(
      referenceDidDocument.publicKey[0].id,
    )
    await referenceDidDocument.digest()

    const excludingProof = { ...didDocumentJSON } as IDidDocumentAttrs
    delete excludingProof.proof

    sandbox.assert.calledWith(jsonld.canonize, excludingProof)
  })

  it('implements getters', async () => {
    /* Makes later comparisons simpler */
    const {
      authentication,
      proof,
      publicKey,
      id,
      service,
      created,
    } = didDocumentWithProofJSON
    proof.signatureValue = ''
    await referenceDidDocument.prepareSignature(publicKey[0].id)
    const auth = referenceDidDocument.authentication.map(auth => auth.toJSON())
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
