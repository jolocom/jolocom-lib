import * as chai from 'chai'
import * as sinon from 'sinon'
import * as crypto from 'crypto'
import { testPublicIdentityKey } from '../data/keys.data'
import {
  didDocumentJSON_v0,
  didDocumentJSON,
  mockDid,
  mockKeyId,
  normalizedDidDocument,
} from '../data/didDocument.data'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import {
  mockPublicKey2,
  mockPubProfServiceEndpointJSON,
} from '../data/didDocumentSections.data'
import {
  ServiceEndpointsSection,
  PublicKeySection,
} from '../../ts/identity/didDocument/sections'
const expect = chai.expect

describe('DidDocument', () => {
  const sandbox = sinon.createSandbox()

  let referenceDidDocument
  let clock

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox
      .stub(crypto, 'randomBytes')
      .returns(Buffer.from('1842fb5f567dd532', 'hex'))
  })

  beforeEach(async () => {
    referenceDidDocument = await DidDocument.fromPublicKey(
      testPublicIdentityKey,
    )
    referenceDidDocument.addAuthKey(mockPublicKey2)
    referenceDidDocument.addServiceEndpoint(
      ServiceEndpointsSection.fromJSON(mockPubProfServiceEndpointJSON),
    )
  })

  after(() => {
    sandbox.restore()
    clock.restore()
  })

  it('Should not try to migrate if DID is not "did:jolo:*"', () => {
    const didDocJSON = {
      '@context': 'https://w3id.org/did/v1',
      id: 'did:uknow:d34db33f',
      publicKey: [
        {
          id: 'did:uknow:d34db33f#cooked',
          type: 'Secp256k1VerificationKey2018',
          owner: 'did:uknow:d34db33f',
          publicKeyHex: 'b9c5714089478a327f09197987f16f9e5d936e8a',
        },
      ],
      authentication: [
        {
          type: 'Secp256k1SignatureAuthentication2018',
          publicKey: 'did:uknow:d34db33f#cooked',
        },
      ],
      service: [],
      created: '',
    }
    expect(() => DidDocument.fromJSON(didDocJSON)).to.not.throw()
  })

  it('Should correctly implement fromJSON for version 0', () => {
    const didDocFromJSON_v0 = DidDocument.fromJSON(didDocumentJSON_v0)
    didDocFromJSON_v0.addAuthKey(mockPublicKey2 as PublicKeySection)
    expect(referenceDidDocument).to.deep.eq(didDocFromJSON_v0)
  })

  it('Should correctly implement fromJSON', () => {
    const didDocFromJSON = DidDocument.fromJSON(didDocumentJSON)
    expect(referenceDidDocument).to.deep.eq(didDocFromJSON)
  })

  it('Should correctly implement toJSON', () => {
    expect(referenceDidDocument.toJSON()).to.deep.eq(didDocumentJSON)
  })

  it('Should correctly implement normalize', async () => {
    const normalized = await referenceDidDocument.normalize()

    expect(normalized).to.deep.eq(normalizedDidDocument)
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
