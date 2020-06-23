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
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { mockPubProfServiceEndpointJSON } from '../data/didDocumentSections.data'
import { ErrorCodes } from '../../ts/errors'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'

const sandbox = sinon.createSandbox()

describe('Jolocom Registry - resolve', () => {
  let registry: any = createJolocomRegistry()

  beforeEach(() => {
    sandbox.stub(registry.ethereumConnector, 'resolveDID')
      .returns(sinon.stub().returns(mockIpfsHash))

    sandbox.stub(registry.ipfsConnector, 'catJSON')
      .returns({ ...didDocumentJSON, service: [] })
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should resolve with no public profile', async () => {
    sandbox.stub(SoftwareKeyProvider, 'verify').returns(true)
    const identity: Identity = await registry.resolve(mockDid)
    expect(registry.ethereumConnector.resolveDID.getCall(0).args).to.deep.eq([
      mockDid,
    ])

    expect(identity.didDocument).to.deep.eq(DidDocument.fromJSON({
      ...didDocumentJSON,
      service: []
    }))

    expect(identity.publicProfile).to.be.undefined
  })

  it('should throw if resolution fails', async () => {
    registry.ethereumConnector.resolveDID = sinon.stub().returns('')
    try {
      await registry.resolve('did:x')
      expect(true).to.be.false
    } catch (err) {
      expect(err.message).to.eq(ErrorCodes.RegistryResolveFailed)
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
})
