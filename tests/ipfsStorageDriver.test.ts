import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import IpfsStorageAgent from '../ts/storage/ipfsStorageAgent'

chai.use(chaiAsPromised)
const expect = chai.expect

describe.only('IpfsStorageAgent', () => {
  let StorageAgent
  const testData = {value: 'test'}
  const testDataHash = 'QmTEST'

  beforeEach(() => {
    StorageAgent = new IpfsStorageAgent({
      host: 'localhost',
      port: 5001,
      protocol: 'http'
    })
  })

  it('Should attempt to store the data', async () => {
    StorageAgent.ipfs = {
      pin: {
        add: (hash, callback) => {
          const result = [{hash: testDataHash}]
          return callback(null, result)
        }
      },
      files: {
        add: (data, callback) => {
          expect(data).to.deep.equal(Buffer.from(JSON.stringify(testData)))

          const result = [{hash: testDataHash}]
          return callback(null, result)
        }
      }
    }
    expect(await StorageAgent.storeJSON(testData)).to.equal(testDataHash)
  })

  it('Should throw error if storing data failed', async () => {
    StorageAgent.ipfs = {
      files: {
        add: (data, callback) => {
          return callback('error', null)
        }
      }
    }

    await expect(StorageAgent.storeJSON(testData))
      .to.be.rejected
  })

  it('Should throw provided data is not JSON,', async () => {
    await expect(StorageAgent.storeJSON('invalidJSON'))
      .to.be.rejected
  })

  it('Should retrieve data based on hash', async () => {
    StorageAgent.ipfs = {
      files: {
        cat: (hash, callback) => {
          expect(hash).to.equal(testDataHash)
          callback(null, Buffer.from(JSON.stringify(testData)))
        }
      }
    }
    expect(await StorageAgent.catJSON(testDataHash)).to.deep.equal(testData)
  })

  it('Should throw error if reading data failed', async () => {
    StorageAgent.ipfs = {
      files: {
        cat: (hash, callback) => {
          return callback('error', null)
        }
      }
    }

    await expect(StorageAgent.catJSON(testDataHash))
      .to.be.rejected
  })

  it('Should attempt to pin the returned hash from storeJSON', async () => {
    StorageAgent.ipfs = {
      pin: {
        add: (hash, callback) => {
          expect(hash).to.equal(testDataHash)
          return callback(null, testDataHash)
        }
      }
    }
    expect(await StorageAgent.pinHash(testDataHash)).to.equal(testDataHash)
  })

  it('Should throw error if reading data failed', async () => {
    StorageAgent.ipfs = {
      pin: {
        add: (hash, callback) => {
          return callback('error', null)
        }
      }
    }

    await expect(StorageAgent.pinHash(testDataHash))
      .to.be.rejected
  })

  it('Should attempt to remove a pinned hash from the IPFS repo', async () => {
    StorageAgent.ipfs = {
      pin: {
        rm: (hash, callback) => {
          expect(hash).to.equal(testDataHash)
          const result = [{hash: testDataHash}]
          return callback(null, result)
        }
      }
    }
    const result = [{hash: testDataHash}]
    expect(await StorageAgent.removePinnedHash(testDataHash)).to.deep.equal(result)
  })

  it('Should throw error if reading data failed', async () => {
    StorageAgent.ipfs = {
      pin: {
        rm: (hash, callback) => {
          return callback('error', null)
        }
      }
    }

    await expect(StorageAgent.removePinnedHash(testDataHash))
      .to.be.rejected
  })

})
