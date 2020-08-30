import * as chai from 'chai'
import * as sinon from 'sinon'
import *  as crypto from '../../ts/utils/crypto'
import *  as nodeCrypto from 'crypto'
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

const expect = chai.expect

describe('DidDocument', async () => {
  const sandbox = sinon.createSandbox()
  const pass = 'password'
  let vault: SoftwareKeyProvider

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

    // Currently stubbing because we have no way
    // to deterministically generate keys on the software
    // key provider, to test signature generation reliably.
    sandbox
      .stub(SoftwareKeyProvider.prototype, 'sign')
      .resolves(
        Buffer.from(
          '3e4bca6a08643c4a67c02abd109accd19f2f9ad1c93cd9f39d3f23edc122de7a72d1de44420b456c20b1875ed254417efdf8dd16fb8ded818d830dac475ec55a',
          'hex'
        )
      )

    vault = await SoftwareKeyProvider.newEmptyWallet(walletUtils, '', pass)
  })

  beforeEach(async () => {
    referenceDidDocument = await DidDocument.fromPublicKey(
      testPublicIdentityKey,
    )

    referenceDidDocument.addAuthKey(
      PublicKeySection.fromJSON(mockPublicKey2)
    )

    referenceDidDocument.addServiceEndpoint(
      ServiceEndpointsSection.fromJSON(mockPubProfServiceEndpointJSON),
    )

    await referenceDidDocument.sign(vault, {
      encryptionPass: pass,
      keyRef: referenceDidDocument.signer.keyId
    })
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
    const didDocumentv0 = DidDocument.fromJSON(didDocumentJSONv0)

    didDocumentv0.addAuthKey(PublicKeySection.fromJSON(mockPublicKey2))


    expect(didDocumentv0).to.deep.eq(referenceDidDocument)
  })

  it('Should correctly implement fromJSON', () => {
    const didDocFromJSON = DidDocument.fromJSON(didDocumentJSON)
    expect(didDocFromJSON).to.deep.eq(referenceDidDocument)
  })

  it('Should correctly implement toJSON', () => {
    expect(referenceDidDocument.toJSON()).to.deep.eq(didDocumentJSON)
  })

  it('Should correctly implement normalize', async () => {
    const { proof, ...document } = didDocumentJSON
    //@ts-ignore
    const njld = await normalizeJsonLd(document, document['@context'])
    expect(njld).to.deep.eq(normalizedDidDocument)
  })

  it('should correctly sign the DID document', async () => {
    await referenceDidDocument.sign(
      vault,
      {
        keyRef: referenceDidDocument.signer.keyId,
        encryptionPass: pass,
      }
    )

    expect(referenceDidDocument.signature).to.eq(
      '3e4bca6a08643c4a67c02abd109accd19f2f9ad1c93cd9f39d3f23edc122de7a72d1de44420b456c20b1875ed254417efdf8dd16fb8ded818d830dac475ec55a',
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
    expect(auth[1]).to.deep.eq(PublicKeySection.fromJSON(authentication[1] as IPublicKeySectionAttrs))

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
