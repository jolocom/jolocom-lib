import * as sinon from 'sinon'

import {
  createJolocomRegistry,
  JolocomRegistry,
} from '../../ts/registries/jolocomRegistry'
import {
  didDocumentJSON,
  mockIpfsHash,
} from '../data/didDocument.data'
import { expect } from 'chai'

/**
 * @TODO Rewrite. With the introduction of the MultiResolver, resolution is entirely delegated.
 *    All that needs to be tested here is that the delegation is correct.
 */

describe('Jolocom Registry - resolve', () => {
  let registry: any = createJolocomRegistry()

  before(() => {
    registry.ethereumConnector.resolveDID = sinon.stub().returns(mockIpfsHash)
    registry.ipfsConnector.catJSON = sinon
      .stub()
      .returns({ ...didDocumentJSON, service: [] })
  })

  afterEach(() => {
    registry = createJolocomRegistry()
  })

  it('should correctly use custom resolution function if passed', async () => {
    const testResolver = sinon.stub().returns(didDocumentJSON)
    const testDidBuilder = sinon.stub().returns('did:test:0')
    const registry = new JolocomRegistry(testResolver, testDidBuilder)
    expect(registry.resolver).to.deep.eq(testResolver)
  })
})
