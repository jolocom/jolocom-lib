import { expect } from 'chai'
import * as sinon from 'sinon'
import {MultiResolver} from '../../ts/resolver'
import {didDocumentJSON} from '../data/didDocument.data'

describe('MultiResolver', () => {
  const testMethodPrefix = 'test'
  const testResolutionMethod = sinon.stub().returns(didDocumentJSON)

  const testResolutionMap = {
    [testMethodPrefix]: testResolutionMethod
  }

  const customResolver = new MultiResolver(testResolutionMap)

  it('instantiates correctly', async () => {
    expect(customResolver.supportedMethods).to.deep.eq([testMethodPrefix])
    expect(await customResolver.resolve('did:test:abc')).to.deep.eq(didDocumentJSON)
  })

  it('attempts to resolve using correct resolver', async () => {
    const testDid = 'did:test:abcdef'
    const didDoc = await customResolver.resolve(testDid)
    expect(didDoc).to.deep.eq(didDocumentJSON)
    sinon.assert.calledWith(testResolutionMethod, testDid)
  })

  /**
   * @TODO blocked by decoupling the did:jolo prefix from internal library functions
   */
  it('does not overwrite default resolution mapping')

  it('does not attempt to resolve unsupported methods', async () => {
    try {
      await customResolver.resolve('did:unsupported:abc')
      /**
       * @TODO correctly test with chai-as-promised
       */
      throw new Error('should not pass')
    } catch(err) {
      expect(err.message).to.contain('Cannot resolve provided method')
    }
  })
})
