import * as chai from 'chai'
import * as sinon from 'sinon'
import * as crypto from 'crypto'
import { testPublicIdentityKey, testSeed } from '../data/keys.data'
import {
  didDocumentJSONv0,
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
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'
import { KeyTypes } from '../../ts/vaultedKeyProvider/types'
import { normalizeJsonLD } from '../../ts/validation/jsonLdValidator'

const expect = chai.expect

describe('DidDocument', () => {
  const sandbox = sinon.createSandbox()
  const vault = SoftwareKeyProvider.fromSeed(testSeed, 'password')
  const derivationArgs = {
    derivationPath: KeyTypes.jolocomIdentityKey,
    encryptionPass: 'password',
  }

  let referenceDidDocument: DidDocument
  let clock

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox.stub(crypto, 'randomBytes').returns(Buffer.from('1842fb5f', 'hex'))
  })

  beforeEach(async () => {
    referenceDidDocument = await DidDocument.fromPublicKey(
      testPublicIdentityKey,
    )

    referenceDidDocument.addAuthKey(
      PublicKeySection.fromJSON(mockPublicKey2, {
        version: 0.13,
      }),
    )

    referenceDidDocument.addServiceEndpoint(
      ServiceEndpointsSection.fromJSON(mockPubProfServiceEndpointJSON),
    )
    await referenceDidDocument.sign(vault, derivationArgs, mockKeyId)
  })

  after(() => {
    sandbox.restore()
    clock.restore()
  })

  it('Should not try to migrate if DID is not "did:jolo:*"', () => {
    const foreignDidDoc = { ...didDocumentJSONv0, id: 'did:unknown:de4bb33f' }
    const didDoc = DidDocument.fromJSON(foreignDidDoc)
    expect(didDoc.did).to.contain('did:unknown')
  })

  it('Should correctly produce normalized form', async () => {
    const normalized = await normalizeJsonLD(
      referenceDidDocument.toJSON(),
      referenceDidDocument.context,
    )

    expect(normalized).to.deep.eq(normalizedDidDocument)
  })

  it('Should correctly implement fromJSON for version 0', async () => {
    const didDocumentv0 = DidDocument.fromJSON(didDocumentJSONv0)
    didDocumentv0.addAuthKey(
      PublicKeySection.fromJSON(mockPublicKey2, { version: 0.13 }),
    )
    await didDocumentv0.sign(vault, derivationArgs, mockKeyId)
    expect(didDocumentv0).to.deep.eq(referenceDidDocument)
  })

  it('Should correctly implement fromJSON', async () => {
    const didDocFromJSON = DidDocument.fromJSON(didDocumentJSON)
    await didDocFromJSON.sign(vault, derivationArgs, mockKeyId)
    expect(didDocFromJSON).to.deep.eq(referenceDidDocument)
  })

  it('Should correctly implement toJSON', () => {
    expect(referenceDidDocument.toJSON()).to.deep.eq(didDocumentJSON)
  })

  it('Should correctly implement normalize', async () => {
    const normalized = await normalizeJsonLD(
      referenceDidDocument.toJSON(),
      referenceDidDocument.context,
    )

    expect(normalized).to.deep.eq(normalizedDidDocument)
  })

  it('should correctly sign the DID document', async () => {
    await referenceDidDocument.sign(
      vault,
      {
        derivationPath: KeyTypes.jolocomIdentityKey,
        encryptionPass: 'password',
      },
      mockKeyId,
    )

    expect(referenceDidDocument.signature).to.eq(
      didDocumentJSON.proof.signatureValue,
    )
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

    expect(auth.length).to.eq(2)
    expect(auth[0]).to.eq(authentication[0])
    expect((auth[1] as PublicKeySection).toJSON()).to.deep.eq(authentication[1])

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
