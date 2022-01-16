import * as chai from 'chai'
import * as sinon from 'sinon'
import { publicProfileCredJSON } from '../data/identity.data'
import { testPublicIdentityKey } from '../data/keys.data'
import { SignedCredential } from '../../ts/credentials/outdated/signedCredential'
import { Identity } from '../../ts/identity/identity'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
const expect = chai.expect

describe('Identity', async () => {
  let clock
  const mockDidDocument = await DidDocument.fromPublicKey(testPublicIdentityKey)
  const mockPublicProfile = SignedCredential.fromJSON(publicProfileCredJSON)

  before(() => {
    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
  })

  it('Should correctly instantiate from did document without public profile', () => {
    const identity = Identity.fromDidDocument({ didDocument: mockDidDocument })
    expect(identity.didDocument).to.deep.eq(mockDidDocument)
    expect(identity.publicProfile).to.be.undefined
  })

  it('Should correctly instantiate from did document including public profile', () => {
    const identity = Identity.fromDidDocument({
      didDocument: mockDidDocument,
      publicProfile: mockPublicProfile,
    })
    expect(identity.didDocument).to.deep.eq(mockDidDocument)
    expect(identity.publicProfile).to.deep.eq(mockPublicProfile)
  })

  it('Should implement all getters', () => {
    const identity = Identity.fromDidDocument({ didDocument: mockDidDocument })
    expect(identity.did).to.eq(mockDidDocument.did)
    expect(identity.didDocument).to.eq(mockDidDocument)
    expect(identity.publicKeySection).to.eq(mockDidDocument.publicKey)
    expect(identity.serviceEndpointSections).to.eq(mockDidDocument.service)
  })

  describe('Serialize as JSON and Parse from JSON', () => {
    it ('Should correctly instantiate from JSON', () => {
      const identity = Identity.fromJSON({
        didDocument: mockDidDocument.toJSON(),
        publicProfile: publicProfileCredJSON,
      })

      expect(identity.didDocument).to.deep.eq(mockDidDocument)
      expect(identity.publicProfile).to.deep.eq(mockPublicProfile)
      expect(identity.did).to.deep.eq(mockDidDocument.did)
    })

    it ('Should correctly serialize to JSON', () => {
      const identity = Identity.fromDidDocument({
        didDocument: mockDidDocument,
        publicProfile: mockPublicProfile,
      })

      expect(identity.toJSON()).to.deep.eq({
        didDocument: mockDidDocument.toJSON(),
        publicProfile: mockPublicProfile.toJSON(),
      })
    })
  })

  /*
   * Following tests are quite repetitive, because all opperations are essentially getters and setters
   * once public profile logic becomes more complexe they should differ more
   */

  describe('Public profile', () => {
    let mockIdentity: Identity

    beforeEach(() => {
      mockIdentity = Identity.fromDidDocument({ didDocument: mockDidDocument })
    })

    it('Should correctly get public profile when present', () => {
      expect(mockIdentity.publicProfile).to.be.undefined
      mockIdentity.publicProfile = mockPublicProfile
      expect(mockIdentity.publicProfile).to.deep.eq(mockPublicProfile)
    })

    it('Should correctly get public profile when missing', () => {
      expect(mockIdentity.publicProfile).to.be.undefined
    })

    it('Should correctly set public profile', () => {
      expect(mockIdentity.publicProfile).to.be.undefined
      mockIdentity.publicProfile = mockPublicProfile
      expect(mockIdentity.publicProfile).to.deep.eq(mockPublicProfile)
    })

    it('Should correctly delete public profile when present', () => {
      mockIdentity.publicProfile = mockPublicProfile
      expect(mockIdentity.publicProfile).to.deep.eq(mockPublicProfile)
      mockIdentity.publicProfile = undefined
      expect(mockIdentity.publicProfile).to.be.undefined
    })

    it('Should correctly delete public profile when missing', () => {
      expect(mockIdentity.publicProfile).to.be.undefined
      mockIdentity.publicProfile = undefined
      expect(mockIdentity.publicProfile).to.be.undefined
    })
  })
})
