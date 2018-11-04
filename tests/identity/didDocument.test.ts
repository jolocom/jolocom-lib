import * as chai from 'chai'
import * as sinon from 'sinon'
import * as crypto from 'crypto'
import { testPublicIdentityKey } from '../data/keys.data'
import { didDocumentJSON, mockDid, mockKeyId, normalized } from '../data/didDocument.data'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
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

  it('Should correctly implement normalize', async () => {
    expect(await referenceDidDocument.normalize()).to.deep.eq(normalized)
  })

  describe('Getters', () => {
    const { authentication, proof, publicKey, id, service, created } = didDocumentJSON

    it('implements getAuthSections', () => {
      const jsonForm = referenceDidDocument.getAuthSections().map(auth => auth.toJSON())
      expect(jsonForm).to.deep.eq(authentication)
    }),
      it('implements getPublicKeySections', () => {
        const jsonForm = referenceDidDocument.getPublicKeySections().map(pub => pub.toJSON())
        expect(jsonForm).to.deep.eq(publicKey)
      }),
      it('implements getServiceEndpointSections', () => {
        const jsonForm = referenceDidDocument.getServiceEndpointSections().map(ser => ser.toJSON())
        expect(jsonForm).to.deep.eq(service)
      }),
      it('implements getContext', () => {
        expect(referenceDidDocument.getContext()).to.deep.eq(didDocumentJSON['@context'])
      }),
      it('implements getDid', () => {
        expect(referenceDidDocument.getDid()).to.deep.eq(id)
      }),
      it('implements getCreationDate', () => {
        expect(referenceDidDocument.getCreationDate().toISOString()).to.deep.eq(created)
      }),
      it('implements getProof', () => {
        expect(referenceDidDocument.getProof().toJSON()).to.deep.eq(proof)
      }),
      it('implements getSignatureValue', () => {
        expect(referenceDidDocument.getSignatureValue()).to.deep.eq(Buffer.from(proof.signatureValue))
      }),
      it('implements getSigner', () => {
        expect(referenceDidDocument.getSigner()).to.deep.eq({
          did: mockDid,
          keyId: mockKeyId
        })
      })
  })
})
