import * as sinon from 'sinon'

import {createJolocomRegistry, JolocomRegistry} from '../../ts/registries/jolocomRegistry'
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
import {MultiResolver} from '../../ts/resolver'

describe('Jolocom Registry - resolve', () => {
  let registry: any = createJolocomRegistry()

  before(() => {
    registry.ethereumConnector.resolveDID = sinon.stub().returns(mockIpfsHash)
    registry.ipfsConnector.catJSON = sinon.stub().returns(didDocumentJSON)
  })

  afterEach(() => {
    registry = createJolocomRegistry()
  })

  it('should resolve with no public profile', async () => {
    const identity: Identity = await registry.resolve(mockDid)
    expect(registry.ethereumConnector.resolveDID.getCall(0).args).to.deep.eq([
      mockDid,
    ])
    expect(identity.publicProfile).to.be.undefined
  })

  it('should throw if resolution fails', async () => {
    registry.ethereumConnector.resolveDID = sinon.stub().returns('')
    try {
      await registry.resolve('did:jolo:abd')
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

    registry.ethereumConnector.resolveDID = sinon.stub().returns(mockIpfsHash)
    registry.ipfsConnector.catJSON = sinon.stub().resolves(extendedDidDoc)
    registry.fetchPublicProfile = sinon
      .stub()
      .resolves(SignedCredential.fromJSON(publicProfileCredJSON))

    const identity: Identity = await registry.resolve(mockDid)
    expect(identity.didDocument.toJSON()).to.deep.eq(extendedDidDoc)
    expect(identity.publicProfile.toJSON()).to.deep.eq(publicProfileCredJSON)
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

  it('should correctly use custom resolution function if passed', async () => {
    const testResolver = sinon.stub().returns(didDocumentJSON)
    const registry = new JolocomRegistry(testResolver)
    expect(registry.resolver).to.deep.eq(testResolver)
  })
})
