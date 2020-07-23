import * as sinon from 'sinon'
import { JolocomRegistry } from '../../ts/registries/jolocomRegistry'
import { expect } from 'chai'
import * as joloDidResolver from 'jolo-did-resolver'
import { didDocumentJSON, mockDid } from '../data/didDocument.data'

import { publicProfileCredJSON } from '../data/identity.data'
import { Identity } from '../../ts/identity/identity'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'
import { mockPubProfServiceEndpointJSON } from '../data/didDocumentSections.data'
import { ErrorCodes } from '../../ts/errors'
import { SoftwareKeyProvider } from '../../ts/vaultedKeyProvider/softwareProvider'

const sandbox = sinon.createSandbox()

describe('Jolocom Registry - resolve', () => {
  beforeEach(() => {
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should resolve with no public profile', async () => {
    const didDocWithoutService = {
      ...didDocumentJSON,
      service: []
    }

    sandbox
      .stub(joloDidResolver, 'getResolver')
      .returns({
        jolo: sinon.stub().resolves(didDocWithoutService)
      })

    sandbox.stub(SoftwareKeyProvider, 'verify').returns(true)

    const { didDocument, publicProfile } = await new JolocomRegistry().resolve(mockDid)

    expect(didDocument).to.deep.eq(DidDocument.fromJSON(didDocWithoutService))
    expect(publicProfile).to.be.undefined
  })

  it('should throw if resolution fails', async () => {
    sandbox
      .stub(joloDidResolver, 'getResolver')
      .returns({
        jolo: sinon.stub().resolves(null)
    })

    return new JolocomRegistry().resolve(mockDid)
      .then(() => new Error('Error should have been thrown')) // TODO
      .catch(err => expect(err.message).to.eq(ErrorCodes.RegistryDIDNotAnchored))
  })

  it('should resolve with public profile', async () => {
     const didDocWithPublicProfile = {
      ...didDocumentJSON,
      service: [mockPubProfServiceEndpointJSON],
    }

    sandbox
      .stub(joloDidResolver, 'getResolver')
      .returns({
        jolo: sinon.stub().resolves(didDocWithPublicProfile)
    })

    sandbox
      .stub(joloDidResolver, 'getPublicProfile')
      .resolves(publicProfileCredJSON)

    const identity: Identity = await new JolocomRegistry().resolve(mockDid)
    expect(identity.didDocument.toJSON()).to.deep.eq(didDocWithPublicProfile)
    expect(identity.publicProfile.toJSON()).to.deep.eq(publicProfileCredJSON)
  })
})
