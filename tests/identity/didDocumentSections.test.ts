import * as chai from 'chai'
import * as sinon from 'sinon'
import * as crypto from 'crypto'
import { PublicKeySection } from '../../ts/identity/didDocument/sections'
import {
  mockPubKeySectionCreationAttrs,
  mockPubKeySectionCreationAttrs2,
  mockPublicKey,
  mockPublicKey3,
  mockPubProfServiceEndpointJSON,
} from '../data/didDocumentSections.data'
import {
  ServiceEndpointsSection,
  generatePublicProfileServiceSection,
} from '../../ts/identity/didDocument/sections/serviceEndpointsSection'
import { mockDid, mockIpfsHash } from '../data/didDocument.data'
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
        expect(section.toJSON()).to.deep.eq(mockPublicKey)
          expect(section.toJSON()).to.have.property('publicKeyHex')
    })

      it('Should correctly instantiate from ethereum address', () => {
          const { publicKey, keyId, did } = mockPubKeySectionCreationAttrs2
          const section = PublicKeySection.fromEthAddress( publicKey, keyId, did )
          expect(section.toJSON()).to.deep.eq(mockPublicKey3)
          expect(section.toJSON()).to.have.property('ethereumAddress')
      })
  })

  describe('Public profile ServiceEndpoint', () => {
    const pubProfEndpSection = generatePublicProfileServiceSection(
      mockDid,
      mockIpfsHash,
    )

    it('Should correctly instantiate from keyId and did', () => {
      expect(pubProfEndpSection.toJSON()).to.deep.eq(
        mockPubProfServiceEndpointJSON,
      )
    })

    it('Should correctly implement fromJSON', () => {
      const serviceEndpointFromJson = ServiceEndpointsSection.fromJSON(
        mockPubProfServiceEndpointJSON,
      )
      const {
        description,
        serviceEndpoint,
        id,
        type,
      } = mockPubProfServiceEndpointJSON

      expect(serviceEndpointFromJson.description).to.eq(description)
      expect(serviceEndpointFromJson.serviceEndpoint).to.eq(serviceEndpoint)
      expect(serviceEndpointFromJson.id).to.eq(id)
      expect(serviceEndpointFromJson.type).to.eq(type)
    })
  })
})
