import * as chai from 'chai'
import * as sinon from 'sinon'
import chaiExclude from 'chai-exclude'
import * as crypto from '../../ts/utils/crypto'
import * as nodeCrypto from 'crypto'
import { testPublicIdentityKey } from '../data/keys.data'
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
import { normalizeJsonLd } from '../../ts/linkedData'
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider'
import { walletUtils } from '@jolocom/native-core'
import { IPublicKeySectionAttrs } from '../../ts/identity/didDocument/sections/types'
import { recoverJoloKeyProviderFromSeed } from '../../ts/didMethods/jolo/recovery'

chai.use(chaiExclude)
const expect = chai.expect

describe('DidDocument', async () => {
  const sandbox = sinon.createSandbox()
  const pass = 'password'
  let vault: SoftwareKeyProvider
  const expectedSignature = Buffer.from(
    didDocumentJSONv0.proof.signatureValue,
    'hex',
  ).toString('base64')

  let referenceDidDocument: DidDocument
  let clock

  before(async () => {
    clock = sinon.useFakeTimers()
    // This sets the nonce on the proof
    sandbox
      .stub(crypto, 'getRandomBytes')
      .resolves(Buffer.from('1842fb5f567dd532', 'hex'))

    // This sets the claimId
    sandbox
      .stub(nodeCrypto, 'randomBytes')
      .resolves(Buffer.from('1842fb5f567dd532', 'hex'))

    vault = await recoverJoloKeyProviderFromSeed(
      Buffer.from('a'.repeat(64), 'hex'),
      pass,
      walletUtils,
    )
  })

  beforeEach(async () => {
    referenceDidDocument = await DidDocument.fromPublicKey(
      testPublicIdentityKey,
    )

    referenceDidDocument.addAuthKey(PublicKeySection.fromJSON(mockPublicKey2))

    referenceDidDocument.addServiceEndpoint(
      ServiceEndpointsSection.fromJSON(mockPubProfServiceEndpointJSON),
    )

    await referenceDidDocument.sign(vault, pass)
  })

  after(() => {
    sandbox.restore()
    clock.restore()
  })

  it('Should correctly implement fromJSON for version 0', () => {
    const didDocumentv0 = DidDocument.fromJSON(didDocumentJSONv0)

    didDocumentv0.addAuthKey(PublicKeySection.fromJSON(mockPublicKey2))

    expect(didDocumentv0)
      .excluding(['_proof', '_signatureValue'])
      .to.deep.eq(referenceDidDocument)
    expect(
      Buffer.from(didDocumentv0.signature, 'hex').toString('base64'),
    ).to.eq(referenceDidDocument.signature)
  })

  it('Should correctly implement fromJSON', () => {
    const didDocFromJSON = DidDocument.fromJSON(didDocumentJSON)
    expect(didDocFromJSON)
      .excluding(['_proof', '_signatureValue'])
      .to.deep.eq(referenceDidDocument)
    expect(
      Buffer.from(didDocFromJSON.signature, 'hex').toString('base64'),
    ).to.eq(referenceDidDocument.signature)
  })

  it('Should correctly implement toJSON', () => {
    const resultJSON = referenceDidDocument.toJSON()
    expect(resultJSON)
      .excluding(['proof', 'signatureValue'])
      .to.deep.eq(didDocumentJSON)
    expect(
      Buffer.from(resultJSON.proof.signatureValue, 'base64').toString('hex'),
    ).to.eq(didDocumentJSON.proof.signatureValue)
  })

  it('Should correctly implement normalize', async () => {
    const { proof, ...document } = didDocumentJSON
    //@ts-ignore
    const njld = await normalizeJsonLd(document, document['@context'])
    expect(njld).to.deep.eq(normalizedDidDocument)
  })

  it('should correctly sign the DID document', async () => {
    await referenceDidDocument.sign(vault, pass)

    expect(referenceDidDocument.signature).to.eq(
      'PkvKaghkPEpnwCq9EJrM0Z8vmtHJPNnznT8j7cEi3npy0d5EQgtFbCCxh17SVEF+/fjdFvuN7YGNgw2sR17FWg==',
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

    expect(auth[0]).to.deep.eq(authentication[0])
    expect(auth[1]).to.deep.eq(
      PublicKeySection.fromJSON(authentication[1] as IPublicKeySectionAttrs),
    )

    expect(pub).to.deep.eq(publicKey)
    expect(serv).to.deep.eq(service)
    expect(referenceDidDocument.context).to.deep.eq(didDocumentJSON['@context'])
    expect(referenceDidDocument.did).to.deep.eq(id)
    expect(referenceDidDocument.created.toISOString()).to.deep.eq(created)
    expect(referenceDidDocument.proof.toJSON())
      .excluding('signatureValue')
      .to.deep.eq(proof)
    expect(referenceDidDocument.signature).to.deep.eq(
      Buffer.from(proof.signatureValue, 'hex').toString('base64'),
    )
    expect(referenceDidDocument.signer).to.deep.eq({
      did: mockDid,
      keyId: mockKeyId,
    })
  })
})
