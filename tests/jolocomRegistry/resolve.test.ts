import * as sinon from 'sinon'
import { createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
import {
  mockDid,
  didDocumentJSON,
  mockIpfsHash,
} from '../data/didDocument.data'
import { expect } from 'chai'
import { SignedCredential } from '../../ts/credentials/signedCredential/signedCredential'
import { publicProfileCredJSON } from '../data/identity.data'
import { Identity } from '../../ts/identity/identity'
import { mockPubProfServiceEndpointJSON } from '../data/didDocumentSections.data'
import { testPublicKey } from '../data/keys.data'

describe('Jolocom Registry - resolve', () => {
  let registry: any = createJolocomRegistry()
  let clock

  before(() => {
    clock = sinon.useFakeTimers()

    registry.ethereumConnector.resolveDID = sinon.stub().returns({
      owner: '0x' + testPublicKey.toString('hex'),
      recovery: '',
      serviceHash: mockIpfsHash,
    })
    registry.ipfsConnector.catJSON = sinon
      .stub()
      .returns(didDocumentJSON.service)
  })

  afterEach(() => {
    registry = createJolocomRegistry()
  })

  after(() => {
    clock.restore()
  })

  it('should resolve with no public profile', async () => {
    const identity: Identity = await registry.resolve(mockDid)
    expect(registry.ethereumConnector.resolveDID.getCall(0).args).to.deep.eq([
      mockDid,
    ])
    expect(identity.publicProfileCredential).to.be.undefined
  })

  it('should throw if resolution fails', async () => {
    registry.ethereumConnector.resolveDID = sinon.stub().returns('')
    try {
      await registry.resolve('did:x')
      expect(true).to.be.false
    } catch (err) {
      expect(err.message).to.eq(
        'Could not retrieve DID Document. No record for DID found.',
      )
    }
  })

  it('should resolve with public profile', async () => {
    const extendedDidDoc = {
      ...didDocumentJSON,
      service: [mockPubProfServiceEndpointJSON],
    }
    registry.ethereumConnector.resolveDID = sinon.stub().returns({
      owner: '0x' + testPublicKey.toString('hex'),
      recovery: '',
      serviceHash: mockIpfsHash,
    })
    registry.ethereumConnector.getCreated = sinon.stub().returns(new Date())
    registry.ethereumConnector.getUpdated = sinon.stub().returns(new Date())
    registry.ethereumConnector.getUpdatedCount = sinon.stub().returns(1)
    registry.ipfsConnector.catJSON = sinon
      .stub()
      .resolves(extendedDidDoc.service)

    const identity: Identity = await registry.resolve(mockDid)

    expect(identity.toDidDocument().toJSON()).to.deep.eq(extendedDidDoc)
    expect(identity.publicProfileCredential.toJSON()).to.deep.eq(
      publicProfileCredJSON,
    )
  })

  it('should implement fetchPublicProfile', async () => {
    registry.ipfsConnector.catJSON = sinon
      .stub()
      .resolves(publicProfileCredJSON)

    const pubProf = await registry.fetchPublicProfile(`ipfs://${mockIpfsHash}`)
    expect(pubProf).to.deep.eq(SignedCredential.fromJSON(publicProfileCredJSON))
    expect(registry.ipfsConnector.catJSON.getCall(0).args).to.deep.eq([
      mockIpfsHash,
    ])
  })
})
