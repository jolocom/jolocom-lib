import { expect } from 'chai'
import * as nock from 'nock'
import { IpfsStorageAgent } from '../ts/ipfs/index'
import { DidDocument } from '../ts/identity/didDocument/index'
import testData from './data/identity'

describe('IpfsStorageAgent', () => {

  let storageAgent

  beforeEach(() => {
    storageAgent = new IpfsStorageAgent()
    storageAgent.configure({
      host: 'localhost',
      port: 5001,
      protocol: 'http'
    })
  })

  it('should attempt to store the data', async () => {

    nock(testData.localHostStorage)
    .post(`/api/v0/add?pin=${testData.pinBoolean}`)
    .reply(200, {
      Name: 'testFile',
      Hash: testData.testHash,
      Bytes: '12345',
      Size: '12345'
    })

    const resultingHash = await storageAgent.storeJSON(testData.expectedDdoObject, testData.pinBoolean)
    expect(resultingHash).to.equal(testData.testHash)
  })

  it('should throw an error if submitted data is not an object', async () => {

    nock(testData.localHostStorage)
    .post(`/api/v0/add?pin=${testData.pinBoolean}`)
    .reply(200, {
      Name: 'testFile',
      Hash: testData.testHash,
      Bytes: '12345',
      Size: '12345'
    })

    try {
      await storageAgent.storeJSON(testData.testDataString, testData.pinBoolean)
    } catch (err) {
      expect(err.message).to.equal('JSON expected, received string')
    }
  })

  it('should attempt to retrieve the data', async () => {

    nock(testData.localHostStorage)
    .get(`/api/v0/cat/${testData.testHash}`)
    .reply(200, {
      file: testData.expectedDdoJson
    })

    const resultingFile = await storageAgent.catJSON(testData.testHash)
    expect(resultingFile).to.deep.equal({file: testData.expectedDdoJson})
  })

  it('should attempt to remove a pinned hash', async () => {

    nock(testData.localHostStorage)
    .get(`/api/v0/pin/rm?arg=${testData.testHash}`)
    .reply(200, {
      Pins: [
        `${testData.testHash}`
      ]
    })

    const pinRemoved = await storageAgent.removePinnedHash(testData.testHash)
    expect(pinRemoved).to.equal(true)
  })

  it('should throw an error if removing the pinned hash failed', async () => {

    nock(testData.localHostStorage)
    .get(`/api/v0/pin/rm?arg=${testData.testHash}`)
    .reply(400, {
      error: 'Error'
    })

    try {
      await storageAgent.removePinnedHash(testData.testHash)
    } catch (err) {
      expect(err.message).to.equal('Removing pinned hash Qm12345 failed, status code: 400')
    }
  })

  it('should attempt to create a DAG object and put via IPLD', async () => {

    nock(testData.localHostStorage)
    .post(`/api/v0/dag/put?pin=${testData.pinBoolean}`)
    .reply(200, {
      Cid: { '/': testData.testHash }
    })

    const resultingHash = await storageAgent.createDagObject(testData.testDataObject, testData.pinBoolean)
    expect(resultingHash).to.deep.equal(testData.testHash)
  })

  it('should throw an error if submitted data is not an object', async () => {

    nock(testData.localHostStorage)
    .post(`/api/v0/dag/put?pin=${testData.pinBoolean}`)
    .reply(200, {
      Cid: { '/': testData.testHash }
    })

    try {
      await storageAgent.createDagObject(testData.testDataString, testData.pinBoolean)
    } catch (err) {
      expect(err.message).to.equal('Object expected, received string')
    }
  })

  it('should attempt to retrieve the DAG object', async () => {

    nock(testData.localHostStorage)
    .get(`/api/v0/dag/get?arg=${testData.testHash}`)
    .reply(200, testData.expectedSignedCredential)

    const resultingFile = await storageAgent.resolveIpldPath(testData.testHash)
    expect(resultingFile).to.deep.equal(testData.expectedSignedCredential)
  })

  it('should resolve nested DAG objects', async () => {

    nock(testData.localHostStorage)
    .get(`/api/v0/dag/get?arg=${testData.testHash}/credential`)
    .reply(200, testData.expectedSignedCredential.credential)

    const resultingFile = await storageAgent.resolveIpldPath(`${testData.testHash}/credential`)
    expect(resultingFile).to.deep.equal(testData.expectedSignedCredential.credential)
  })
})
