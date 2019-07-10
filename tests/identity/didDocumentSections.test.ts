import * as chai from 'chai'
import * as sinon from 'sinon'
import * as crypto from 'crypto'
import {
  PublicKeySection,
  AuthenticationSection,
} from '../../ts/identity/didDocument/sections'
import {
  mockPubKeySectionCreationAttrs,
  mockPubKeySectionJSON,
  mockAuthSectionJSON,
  mockPubProfServiceEndpointJSON,
  mockServiceEndpointJSON,
} from '../data/didDocumentSections.data'
import {
  ServiceEndpointsSection,
  generatePublicProfileServiceSection,
} from '../../ts/identity/didDocument/sections/serviceEndpointsSection'
import { mockDid } from '../data/didDocument.data'
import { publicProfileCredJSON } from '../data/identity.data'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
const expect = chai.expect

describe('DidDocumentSections', () => {
  const sandbox = sinon.createSandbox()

  let clock

  before(() => {
    clock = sinon.useFakeTimers()
    sandbox
      .stub(crypto, 'randomBytes')
      .returns(Buffer.from('1842fb5f567dd532', 'hex'))
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
    const pubProfEndpSection = generatePublicProfileServiceSection(
      mockDid,
      SignedCredential.fromJSON(publicProfileCredJSON),
    )

    it('Should correctly instantiate from keyId and did', () => {
      expect(pubProfEndpSection.toJSON()).to.deep.eq(
        mockPubProfServiceEndpointJSON,
      )
    })

    it('Should correctly implement fromJSON with public profile', () => {
      const serviceEndpointFromJson = ServiceEndpointsSection.fromJSON(
        mockPubProfServiceEndpointJSON,
      )
      const { description, id, type } = mockPubProfServiceEndpointJSON

      expect(serviceEndpointFromJson.description).to.eq(description)
      expect(serviceEndpointFromJson.serviceEndpoint).to.deep.eq(
        SignedCredential.fromJSON(publicProfileCredJSON),
      )
      expect(serviceEndpointFromJson.id).to.eq(id)
      expect(serviceEndpointFromJson.type).to.eq(type)
    })

    it('Should correctly implement fromJSON without public profile', () => {
      const serviceEndpointFromJson = ServiceEndpointsSection.fromJSON(
        mockServiceEndpointJSON,
      )
      const { description, serviceEndpoint, id, type } = mockServiceEndpointJSON

      expect(serviceEndpointFromJson.description).to.eq(description)
      expect(serviceEndpointFromJson.serviceEndpoint).to.eq(serviceEndpoint)
      expect(serviceEndpointFromJson.id).to.eq(id)
      expect(serviceEndpointFromJson.type).to.eq(type)
    })
  })
})
