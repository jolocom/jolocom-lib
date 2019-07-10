import * as chai from 'chai'
import * as sinon from 'sinon'
import { publicProfileCredJSON } from '../data/identity.data'
import { testPublicKey } from '../data/keys.data'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { Identity } from '../../ts/identity/identity'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { generatePublicProfileServiceSection } from '../../ts/identity/didDocument/sections/serviceEndpointsSection'
import { keyIdToNumber } from '../../ts/utils/helper'
const expect = chai.expect

describe('Identity', () => {
  let clock
  let mockDidDocument = DidDocument.fromPublicKey(testPublicKey)
  const mockPublicProfile = SignedCredential.fromJSON(publicProfileCredJSON)

  before(() => {
    clock = sinon.useFakeTimers()
  })

  beforeEach(() => {
    mockDidDocument = DidDocument.fromPublicKey(testPublicKey)
    mockDidDocument.addServiceEndpoint(
      generatePublicProfileServiceSection(
        mockDidDocument.did,
        mockPublicProfile,
      ),
    )
  })

  after(() => {
    clock.restore()
  })

  it('Should correctly instantiate from did document without public profile', () => {
    const mockDidDocument = DidDocument.fromPublicKey(testPublicKey)

    const identity = Identity.fromDidDocument(mockDidDocument)
    expect(identity.publicKey.hexValue).to.eq(
      mockDidDocument.publicKey[0].publicKeyHex,
    )
    expect(
      mockDidDocument.publicKey[0].id.endsWith(
        identity.publicKey.keyId.toString(),
      ),
    ).to.be.true
    expect(identity.publicProfileCredential).to.be.undefined
  })

  it('Should correctly instantiate from did document including public profile', () => {
    const identity = Identity.fromDidDocument(mockDidDocument)
    expect(identity.publicProfileCredential).to.deep.eq(mockPublicProfile)
  })

  it('Should implement all getters', () => {
    const identity = Identity.fromDidDocument(mockDidDocument)
    expect(identity.did).to.eq(mockDidDocument.did)
    const publicKeySection = mockDidDocument.publicKey.find(
      p => mockDidDocument.authentication[0].publicKey == p.id,
    )
    expect(identity.publicKey).to.deep.eq({
      hexValue: publicKeySection.publicKeyHex,
      keyId: keyIdToNumber(publicKeySection.id),
    })
    // expect(identity.recoveryKey).to.eq(mockDidDocument) TODO Authorization section is needed for that
    expect(identity.services).to.eq(mockDidDocument.service)
    expect(identity.publicProfileCredential).to.eq(
      mockDidDocument.service.find(s => s.type === 'JolocomPublicProfile')
        .serviceEndpoint,
    )
  })

  it('should implement to DID Document correctly', () => {
    const identity = Identity.fromDidDocument(mockDidDocument)
    const didDocument = identity.toDidDocument()
    expect(didDocument).to.deep.equal(mockDidDocument)
  })
})
