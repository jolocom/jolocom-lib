import { expect } from 'chai'
import * as sinon from 'sinon'
import { createValidatingResolver, MultiResolver } from '../../ts/resolver'
import { didDocumentJSON } from '../data/didDocument.data'

describe('MultiResolver', () => {
  const testMethodPrefix = 'test'
  const testDid = 'did:test:abc'
  const testResolutionMethod = sinon.stub().returns(didDocumentJSON)

  const testResolutionMap = {
    [testMethodPrefix]: testResolutionMethod,
  }

  const customResolver = new MultiResolver(testResolutionMap)

  it('instantiates correctly', async () => {
    expect(customResolver.supportedMethods).to.deep.eq([testMethodPrefix])
    expect(await customResolver.resolve(testDid)).to.deep.eq(didDocumentJSON)
  })

  it('attempts to resolve using correct resolver', async () => {
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
      /** @TODO correctly test with chai-as-promised */
      throw new Error('should not pass')
    } catch (err) {
      expect(err.message).to.contain('Cannot resolve provided method')
    }
  })
})

describe('Validating resolver creator function', () => {
  const testDid = 'did:test:abc'

  const resolver = sinon.stub().resolves(didDocumentJSON)
  const validator = sinon.stub().resolves(true)

  it('Should correctly compose resolver and validator', async () => {
    const validatingResolver = createValidatingResolver(resolver, validator)
    expect(await validatingResolver(testDid)).to.deep.eq(didDocumentJSON)
    sinon.assert.calledWith(resolver, testDid)
    sinon.assert.calledWith(validator, didDocumentJSON)
  })

  it('Should correctly throw if validation fails', async () => {
    const throwingValidator = async () => false
    const brokenValidatingResolver = createValidatingResolver(
      resolver,
      throwingValidator,
    )

    /** @TODO correctly test with chai-as-promised */
    try {
      await brokenValidatingResolver(testDid)
      throw new Error('should not pass')
    } catch (err) {
      expect(err.message).to.eq('DID Document validation failed')
    }
  })
})
