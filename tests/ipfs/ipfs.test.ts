import { expect } from 'chai'
import * as nock from 'nock'
import { IpfsStorageAgent } from '../../ts/ipfs/index'
import {
  localHostStorage,
  pinBoolean,
  testDataObject,
  testDataString,
  testHash,
  testDDO,
} from '../data/ipfs/ipfs'
import { singleClaimCredentialJSON } from '../data/credential/credential'

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
    nock(localHostStorage)
      .post(`/api/v0/add?pin=${pinBoolean}`)
      .reply(200, {
        Name: 'testFile',
        Hash: testHash,
        Bytes: '12345',
        Size: '12345'
      })

    const resultingHash = await storageAgent.storeJSON(testDDO, pinBoolean)
    expect(resultingHash).to.equal(testHash)
  })

  it('should throw an error if submitted data is not an object', async () => {
    nock(localHostStorage)
      .post(`/api/v0/add?pin=${pinBoolean}`)
      .reply(200, {
        Name: 'testFile',
        Hash: testHash,
        Bytes: '12345',
        Size: '12345'
      })

    try {
      await storageAgent.storeJSON(testDataString, pinBoolean)
    } catch (err) {
      expect(err.message).to.equal('JSON expected, received string')
    }
  })

  it('should attempt to retrieve the data', async () => {
    nock(localHostStorage)
      .get(`/api/v0/cat/${testHash}`)
      .reply(200, {
        file: testDDO
      })

    const resultingFile = await storageAgent.catJSON(testHash)
    expect(resultingFile).to.deep.equal({ file: testDDO })
  })

  it('should attempt to remove a pinned hash', async () => {
    nock(localHostStorage)
      .get(`/api/v0/pin/rm?arg=${testHash}`)
      .reply(200, {
        Pins: [`${testHash}`]
      })

    const removePinnedHashCall = () => {
      storageAgent.removePinnedHash(testHash)
    }
    await expect(removePinnedHashCall).to.not.throw()
  })

  it('should throw an error if removing the pinned hash failed', async () => {
    nock(localHostStorage)
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
    nock(localHostStorage)
      .post(`/api/v0/dag/put?pin=${pinBoolean}`)
      .reply(200, {
        Cid: { '/': testHash }
      })

    const resultingHash = await storageAgent.createDagObject(testDataObject, pinBoolean)
    expect(resultingHash).to.deep.equal(testHash)
  })

  it('should throw an error if submitted data is not an object', async () => {
    nock(localHostStorage)
      .post(`/api/v0/dag/put?pin=${pinBoolean}`)
      .reply(200, {
        Cid: { '/': testHash }
      })

    try {
      await storageAgent.createDagObject(testDataString, pinBoolean)
    } catch (err) {
      expect(err.message).to.equal('Object expected, received string')
    }
  })

  it('should attempt to retrieve the DAG object', async () => {
    nock(localHostStorage)
      .get(`/api/v0/dag/get?arg=${testHash}`)
      .reply(200, singleClaimCredentialJSON)

    const resultingFile = await storageAgent.resolveIpldPath(testHash)
    expect(resultingFile).to.deep.equal(singleClaimCredentialJSON)
  })

  it('should resolve nested DAG objects', async () => {
    nock(localHostStorage)
      .get(`/api/v0/dag/get?arg=${testHash}/claim`)
      .reply(200, singleClaimCredentialJSON.claim)

    const resultingFile = await storageAgent.resolveIpldPath(`${testHash}/claim`)
    expect(resultingFile).to.deep.equal(singleClaimCredentialJSON.claim)
  })
})
