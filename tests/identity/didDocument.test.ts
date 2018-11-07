import * as chai from 'chai'
import * as sinon from 'sinon'
import * as crypto from 'crypto'
import * as jsonld from 'jsonld'
import { testPublicIdentityKey } from '../data/keys.data'
import { didDocumentJSON, mockDid, mockKeyId, normalizedDidDocument } from '../data/didDocument.data'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { IDidDocumentAttrs } from '../../ts/identity/didDocument/types';
const expect = chai.expect

describe('DidDocument', () => {
  const sandbox = sinon.createSandbox()

  let referenceDidDocument = DidDocument.fromPublicKey(testPublicIdentityKey)
  let clock

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox.stub(jsonld, 'canonize').returns(normalizedDidDocument)
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
    await referenceDidDocument.digest()

    const excludingProof = {...didDocumentJSON} as IDidDocumentAttrs
    delete excludingProof.proof

    sandbox.assert.calledWith(jsonld.canonize, excludingProof)
  })

  describe('Getters', () => {
    const { authentication, proof, publicKey, id, service, created } = didDocumentJSON

    it('implements getAuthSections', () => {
      const jsonForm = referenceDidDocument.authentication.map(auth => auth.toJSON())
      expect(jsonForm).to.deep.eq(authentication)
    }),
      it('implements getPublicKeySections', () => {
        const jsonForm = referenceDidDocument.publicKey.map(pub => pub.toJSON())
        expect(jsonForm).to.deep.eq(publicKey)
      }),
      it('implements getServiceEndpointSections', () => {
        const jsonForm = referenceDidDocument.service.map(ser => ser.toJSON())
        expect(jsonForm).to.deep.eq(service)
      }),
      it('implements getContext', () => {
        expect(referenceDidDocument.context).to.deep.eq(didDocumentJSON['@context'])
      }),
      it('implements getDid', () => {
        expect(referenceDidDocument.did).to.deep.eq(id)
      }),
      it('implements getCreationDate', () => {
        expect(referenceDidDocument.created.toISOString()).to.deep.eq(created)
      }),
      it('implements getProof', () => {
        expect(referenceDidDocument.proof.toJSON()).to.deep.eq(proof)
      }),
      it('implements getSignatureValue', () => {
        expect(referenceDidDocument.signatureValue).to.deep.eq(proof.signatureValue)
      }),
      it('implements getSigner', () => {
        expect(referenceDidDocument.signer).to.deep.eq({
          did: mockDid,
          keyId: mockKeyId,
        })
      })
  })
})
