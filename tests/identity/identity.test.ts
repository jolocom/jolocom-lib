import * as chai from 'chai'
import * as sinon from 'sinon'
import { publicProfileCredJSON } from '../data/identity.data'
import { testPublicIdentityKey } from '../data/keys.data'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { Identity } from '../../ts/identity/identity'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
const expect = chai.expect

describe('Identity', () => {
  let clock
  const mockDidDocument = DidDocument.fromPublicKey(testPublicIdentityKey)
  const mockPublicProfile = SignedCredential.fromJSON(publicProfileCredJSON)

  before(() => {
    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
  })

  it('Should correctly instantiate from did document without public profile', () => {
    const identity = Identity.fromDidDocument({ didDocument: mockDidDocument })
    expect(identity.getDidDocument()).to.deep.eq(mockDidDocument)
    expect(identity.publicProfile.get()).to.be.undefined
  })

  it('Should correctly instantiate from did document including public profile', () => {
    const identity = Identity.fromDidDocument({ didDocument: mockDidDocument, publicProfile: mockPublicProfile })
    expect(identity.getDidDocument()).to.deep.eq(mockDidDocument)
    expect(identity.publicProfile.get()).to.deep.eq(mockPublicProfile)
  })

  it('Should implement all getters', () => {
    const identity = Identity.fromDidDocument({ didDocument: mockDidDocument })
    expect(identity.getDid()).to.eq(mockDidDocument.getDid())
    expect(identity.getDidDocument()).to.eq(mockDidDocument)
    expect(identity.getPublicKeySection()).to.eq(mockDidDocument.getPublicKeySections())
    expect(identity.getServiceEndpointSections()).to.eq(mockDidDocument.getServiceEndpointSections())
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
      expect(mockIdentity.publicProfile.get()).to.be.undefined
      mockIdentity.publicProfile.set(mockPublicProfile)
      expect(mockIdentity.publicProfile.get()).to.deep.eq(mockPublicProfile)
    })

    it('Should correctly get public profile when missing', () => {
      expect(mockIdentity.publicProfile.get()).to.be.undefined
    })

    it('Should correctly set public profile', () => {
      expect(mockIdentity.publicProfile.get()).to.be.undefined
      mockIdentity.publicProfile.set(mockPublicProfile)
      expect(mockIdentity.publicProfile.get()).to.deep.eq(mockPublicProfile)
    })

    it('Should correctly delete public profile when present', () => {
      mockIdentity.publicProfile.set(mockPublicProfile)
      expect(mockIdentity.publicProfile.get()).to.deep.eq(mockPublicProfile)
      mockIdentity.publicProfile.delete()
      expect(mockIdentity.publicProfile.get()).to.be.undefined
    })

    it('Should correctly delete public profile when missing', () => {
      expect(mockIdentity.publicProfile.get()).to.be.undefined
      mockIdentity.publicProfile.delete()
      expect(mockIdentity.publicProfile.get()).to.be.undefined
    })
  })
})
