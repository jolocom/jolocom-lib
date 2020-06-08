import * as sinon from 'sinon'
import { createJolocomRegistry } from '../../ts/registries/jolocomRegistry'
import {
} from '../data/didDocument.data'
import { expect } from 'chai'
import * as joloDidResolver from 'jolo-did-resolver'
import { didDocumentJSON, mockDid } from '../data/didDocument.data'
import { ErrorCodes } from '../../ts/errors'
import { mockPubProfServiceEndpointJSON } from '../data/didDocumentSections.data'
import { publicProfileCredJSON } from '../data/identity.data'
import { DidDocument } from '../../ts/identity/didDocument/didDocument'

const sandbox = sinon.createSandbox()

describe('Jolocom Registry - resolve', () => {
  afterEach(() => {
    sandbox.restore()
  })

  it('should resolve with no public profile', async () => {
    sandbox
      .stub(joloDidResolver, 'getResolver')
      .returns({
        jolo: sinon.stub().resolves(didDocumentJSON)
    })

    const { didDocument, publicProfile } = await createJolocomRegistry().resolve(mockDid)

    expect(didDocument).to.deep.eq(DidDocument.fromJSON(didDocumentJSON))
    expect(publicProfile).to.be.undefined
  })

  it('should throw if resolution fails', async () => {
    sandbox
      .stub(joloDidResolver, 'getResolver')
      .returns({
        jolo: () => ""
    })

    return createJolocomRegistry().resolve(mockDid)
      .then(() => new Error('Error should have been thrown')) // TODO
      .catch(err => expect(err.message).to.eq(ErrorCodes.RegistryResolveFailed))
  })

  it('should resolve with public profile', async () => {
     const didDocWithPublicProfile = {
      ...didDocumentJSON,
      service: [mockPubProfServiceEndpointJSON],
    }

    sandbox
      .stub(joloDidResolver, 'getPublicProfile')
      .returns(publicProfileCredJSON)

    sandbox
      .stub(joloDidResolver, 'getResolver')
      .returns({
        jolo: () => didDocWithPublicProfile
    })

    const identity = await createJolocomRegistry().resolve(mockDid)
    sandbox.assert.calledWith(joloDidResolver.getPublicProfile, didDocWithPublicProfile)
    expect(identity.publicProfile.toJSON()).to.deep.eq(publicProfileCredJSON)
  })
})
