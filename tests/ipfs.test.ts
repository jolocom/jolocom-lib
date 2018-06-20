import { expect } from 'chai'
import * as nock from 'nock'
import { IpfsStorageAgent } from '../ts/ipfs/index'
import { DidDocument } from '../ts/identity/didDocument/index'

describe('IpfsStorageAgent', () => {

  let storageAgent
  // tslint:disable-next-line:max-line-length
  const testUserPublicKey = '04334f990cdc1281c6fed73dcc6de3db520c075a41ce2b93f36f85dbd5e0dc0b05975c51acb0bec9747fb3f52fd0146d1dc39d6077db0be1bd6579fd66ac144442'
  const key = Buffer.from(testUserPublicKey, 'utf8')
  const did = new DidDocument().fromPublicKey(key)
  const testHash = 'Qm12345'

  beforeEach(() => {

    storageAgent = new IpfsStorageAgent()
    storageAgent.configure({
      host: 'localhost',
      port: 5001,
      protocol: 'http'
    })
  })

  it('should attempt to store the data', async () => {

    const pinBoolean = true

    nock('http://localhost:5001')
    .post(`/api/v0/add?pin=${pinBoolean}`)
    .reply(200, {
      Name: 'testFile',
      Hash: 'Qm12345',
      Bytes: '12345',
      Size: '12345'
    })

    const resultingHash = await storageAgent.storeJSON(did, pinBoolean)
    .then((result) => {
      return result
    })
    expect(resultingHash).to.equal('Qm12345')
  })

  it('should throw an error if submitted data is not an object', async () => {

    const pinBoolean = true

    const testData = 'testData'

    nock('http://localhost:5001')
    .post(`/api/v0/add?pin=${pinBoolean}`)
    .reply(200, {
      Name: 'testFile',
      Hash: 'Qm12345',
      Bytes: '12345',
      Size: '12345'
    })

    try {
      await storageAgent.storeJSON(testData, pinBoolean)
    } catch (err) {
      expect(err.message).to.equal('JSON expected, received string')
    }
  })

  it('should attempt to retrieve the data', async () => {

    nock('http://localhost:5001')
    .get(`/api/v0/cat/${testHash}`)
    .reply(200, {
      file: 'test DDO file'
    })

    const resultingFile = await storageAgent.catJSON(testHash)
    .then((result) => {
      return result
    })
    expect(resultingFile).to.deep.equal({file: 'test DDO file'})
  })

  it('should attempt to remove a pinned hash', async () => {

    nock('http://localhost:5001')
    .get(`/api/v0/pin/rm?arg=${testHash}`)
    .reply(200, {
      Pins: [
        `${testHash}`
      ]
    })

    const pinRemoved = await storageAgent.removePinnedHash(testHash)
    .then((result) => {
      return result
    })
    expect(pinRemoved).to.equal(true)
  })

  it('should throw an error if removing the pinned hash failed', async () => {

    nock('http://localhost:5001')
    .get(`/api/v0/pin/rm?arg=${testHash}`)
    .reply(400, {
      error: 'Error'
    })

    try {
      await storageAgent.removePinnedHash(testHash)
    } catch (err) {
      expect(err.message).to.equal('Removing pinned hash Qm12345 failed, status code: 400')
    }
  })

  it('should attempt to create a DAG object and put via IPLD', async () => {

    const pinBoolean = true

    const testDagData = { data: 'testData' }

    nock('http://localhost:5001')
    .post(`/api/v0/dag/put?pin=${pinBoolean}`)
    .reply(200, {
      Cid: { '/': testHash }
    })

    const resultingHash = await storageAgent.createDagObject(testDagData, pinBoolean)
    .then((result) => {
      return result
    })
    expect(resultingHash).to.deep.equal(testHash)
  })

  it('should throw an error if submitted data is not an object', async () => {

    const pinBoolean = true

    const testDagData = 'testData'

    nock('http://localhost:5001')
    .post(`/api/v0/dag/put?pin=${pinBoolean}`)
    .reply(200, {
      Cid: { '/': testHash }
    })

    try {
      await storageAgent.createDagObject(testDagData, pinBoolean)
    } catch (err) {
      expect(err.message).to.equal('Object expected, received string')
    }
  })

  it('should attempt to retrieve the DAG object', async () => {

    nock('http://localhost:5001')
    .get(`/api/v0/dag/get?arg=${testHash}`)
    .reply(200, {
      file: 'test DDO file',
      ipld: 'this should be the result'
    })

    const resultingFile = await storageAgent.resolveIpldPath(testHash)
    .then((result) => {
      return result
    })
    expect(resultingFile).to.deep.equal({
      file: 'test DDO file',
      ipld: 'this should be the result'
    })
  })

  it('should resolve nested DAG objects', async () => {

    nock('http://localhost:5001')
    .get(`/api/v0/dag/get?arg=${testHash}/ipld`)
    .reply(200, {
      ipld: 'this should be the result'
    })

    const resultingFile = await storageAgent.resolveIpldPath(`${testHash}/ipld`)
    .then((result) => {
      return result
    })
    expect(resultingFile).to.deep.equal({ipld: 'this should be the result'})
  })
})
