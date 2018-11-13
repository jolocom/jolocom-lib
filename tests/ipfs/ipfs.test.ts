import * as sinon from 'sinon'
import { expect } from 'chai'
import { IpfsStorageAgent } from '../../ts/ipfs/ipfs'
import { testHash, mockConfig, mockBaseUri, mockAddUrl, mockCatUrl, mockPinUrl } from '../data/ipfs.data'
import { didDocumentJSON } from '../data/didDocument.data';

describe('IpfsStorageAgent', () => {
  let storageAgent = new IpfsStorageAgent(mockConfig)

  const stubbedFetch = sinon.stub().resolves({ json: sinon.stub().resolves({ Hash: testHash }) })
  storageAgent.fetchImplementation = stubbedFetch

  afterEach(() => {
    stubbedFetch.resetHistory()
  })

  it('should correctly instantiate', () => {
    expect(storageAgent.endpoint).to.eq(mockBaseUri)
  })

  /* We decode the did document from the form data to compare, otherwise we have to rely on form data here */

  it('should attempt to store the data', async () => {
    await storageAgent.storeJSON({ data: didDocumentJSON, pin: true })
    const formData = stubbedFetch.getCall(0).args[1].body

    compareFormData(formData, didDocumentJSON)
    expect(stubbedFetch.getCall(0).args[0]).to.eq(mockAddUrl)
  })

  it('should throw an error if submitted data is not an object', async () => {
    try {
      await storageAgent.storeJSON({
        data: 5 as Object,
        pin: false
      })
      expect(true).to.be.false
    } catch (err) {
      expect(err.message).to.contain('JSON expected')
    }
  })

  it('should attempt to retrieve the data', async () => {
    await storageAgent.catJSON(testHash)
    expect(stubbedFetch.getCall(0).args).to.deep.eq([mockCatUrl])
  })

  it('should attempt to remove a pinned hash', async () => {
    const successRespMock = sinon.stub().returns({ ok: true })

    storageAgent.fetchImplementation = successRespMock
    await storageAgent.removePinnedHash(testHash)
    expect(successRespMock.getCall(0).args).to.deep.eq([mockPinUrl])
  })

  it('should throw an error if removing the pinned hash failed', async () => {
    const errorRespMock = sinon.stub().returns({ ok: false, status: 500 })
    storageAgent.fetchImplementation = errorRespMock
    try {
      await storageAgent.removePinnedHash(testHash)
      expect(false).to.be.true
    } catch (err) {
      expect(err.message).to.contain(`Removing pinned hash ${testHash} failed`)
    }
  })
})

/**
 * Helper method to decode the payload of form data and compare it to json
 * @param formData - Form data instance containing encoded data
 * @param reference - JSON document to compare to
 */

const compareFormData = (formData, reference) => {
  const decodedMsg = formData._streams[1].toString()
  expect(JSON.parse(decodedMsg)).to.deep.eq(reference)
}