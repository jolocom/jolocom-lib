import * as sinon from 'sinon'
import { expect } from 'chai'
import { didDocumentJSON, mockDid } from '../../data/didDocument.data'

import { publicProfileCredJSON } from '../../data/identity.data'
import { Identity } from '../../../ts/identity/identity'
import { DidDocument } from '../../../ts/identity/didDocument/didDocument'
import { mockPubProfServiceEndpointJSON } from '../../data/didDocumentSections.data'
import { ErrorCodes } from '../../../ts/errors'
import { JolocomResolver } from '../../../ts/didMethods/jolo/resolver'
import { Resolver } from 'did-resolver'
import { parseAndValidate } from '../../../ts/parse/parseAndValidate'
import { SignedCredential } from '../../../ts/credentials/outdated/signedCredential'

const sandbox = sinon.createSandbox()

const docWithoutPubProfile = {
  ...didDocumentJSON,
  service: []
}

describe('Jolo Did method - resolve', () => {
  before(() => {
    sandbox.stub(parseAndValidate, 'signedCredential')
    .resolves(SignedCredential.fromJSON(
      publicProfileCredJSON
    ))

    sandbox.stub(parseAndValidate, 'didDocument')
    .onCall(0).resolves(DidDocument.fromJSON(docWithoutPubProfile))
    .onCall(1).resolves(DidDocument.fromJSON(didDocumentJSON))
  })

  after(() => {
    sandbox.restore()
  })

  it('should resolve with no public profile', async () => {
    const didDocWithoutPubProfilie = {
      ...didDocumentJSON,
      service: [],
    }

    const testResolver = new JolocomResolver()

    //@ts-ignore resolutionFunctions is private
    testResolver.resolutionFunctions.resolve = async () =>
      //@ts-ignore
      didDocWithoutPubProfilie

    //@ts-ignore resolutionFunctions is private
    testResolver.resolutionFunctions.getPublicProfile = async didDoc => {
      return null
    }

    const { didDocument, publicProfile } = await testResolver.resolve(mockDid)

    expect(didDocument).to.deep.eq(
      DidDocument.fromJSON(didDocWithoutPubProfilie),
    )
    expect(publicProfile).to.be.undefined
  })

  it('should throw if resolution fails', async () => {
    const testResolver = new JolocomResolver()

    //@ts-ignore
    testResolver.resolutionFunctions.resolve = new Resolver({
      jolo: async (did: string) => null
    }).resolve

    return testResolver
      .resolve(mockDid)
      .then(() => new Error('Error should have been thrown')) // TODO
      .catch(err =>
        expect(err.message).to.eq(ErrorCodes.RegistryDIDNotAnchored),
      )
  })

  it('should resolve with public profile', async () => {
    const testResolver = new JolocomResolver()

    //@ts-ignore resolutionFunctions is private
    testResolver.resolutionFunctions.resolve = async () => ({
      ...didDocumentJSON,
      service: [mockPubProfServiceEndpointJSON],
    })

    //@ts-ignore resolutionFunctions is private
    testResolver.resolutionFunctions.getPublicProfile = async () =>
      publicProfileCredJSON

    const identity: Identity = await testResolver.resolve(mockDid)
    expect(identity.didDocument.toJSON()).to.deep.eq({
      ...didDocumentJSON,
      service: [mockPubProfServiceEndpointJSON],
    })
    expect(identity.publicProfile.toJSON()).to.deep.eq(publicProfileCredJSON)
  })
})
