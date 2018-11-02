import * as chai from 'chai'
import * as sinon from 'sinon'
import * as crypto from 'crypto'
import { PublicKeySection, AuthenticationSection } from '../../ts/identity/didDocument/sections'
import {
  mockPubKeySectionCreationAttrs,
  mockPubKeySectionJSON,
  mockAuthSectionJSON,
  mockPubProfServiceEndpointJSON
} from '../data/didDocumentSections.data'
import {
  PublicProfileServiceEndpoint,
  ServiceEndpointsSection
} from '../../ts/identity/didDocument/sections/serviceEndpointsSection'
import { mockDid, mockIpfsHash } from '../data/didDocument'
const expect = chai.expect

describe('DidDocumentSections', () => {
  const sandbox = sinon.createSandbox()

  let clock

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox.stub(crypto, 'randomBytes').returns(Buffer.from('1842fb5f567dd532', 'hex'))
  })

  after(() => {
    sandbox.restore()
    clock.restore()
  })

  describe('PublicKeySection', () => {
    it('Should correctly instantiate from secp256k1 public key', () => {
      const { publicKey, keyId, did } = mockPubKeySectionCreationAttrs
      const section = PublicKeySection.fromEcdsa(publicKey, keyId, did)
      expect(section.toJSON()).to.deep.eq(mockPubKeySectionJSON)
    })
  })

  describe('AuthenticationSection', () => {
    it('Should correctly instantiate from public key section', () => {
      const { publicKey, keyId, did } = mockPubKeySectionCreationAttrs
      const pubKeySection = PublicKeySection.fromEcdsa(publicKey, keyId, did)
      const authSection = AuthenticationSection.fromEcdsa(pubKeySection)
      expect(authSection.toJSON()).to.deep.eq(mockAuthSectionJSON)
    })
  })

  describe('Public profile ServiceEndpoint', () => {
    const pubProfEndpSection = PublicProfileServiceEndpoint.create(mockDid, mockIpfsHash)

    it('Should correctly instantiate from keyId and did', () => {
      expect(pubProfEndpSection.toJSON()).to.deep.eq(mockPubProfServiceEndpointJSON)
    })

    it('Should correctly implement fromJSON', () => {
      const serviceEndpointFromJson = ServiceEndpointsSection.fromJSON(mockPubProfServiceEndpointJSON)
      const { description, serviceEndpoint, id, type } = mockPubProfServiceEndpointJSON

      expect(serviceEndpointFromJson.getDescription()).to.eq(description)
      expect(serviceEndpointFromJson.getEndpoint()).to.eq(serviceEndpoint)
      expect(serviceEndpointFromJson.getId()).to.eq(id)
      expect(serviceEndpointFromJson.getType()).to.eq(type)
    })
  })
})
