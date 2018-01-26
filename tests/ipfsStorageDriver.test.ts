import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import IpfsStorageAgent from '../ts/storage/ipfsStorageAgent'

chai.use(chaiAsPromised)

const expect = chai.expect


describe('IpfsStorageAgent', () => {
  let StorageAgent
  const testData = {value: 'test'}
  const testDataHash = 'QmTEST'

  beforeEach(() => {
    StorageAgent = new IpfsStorageAgent({
      host: 'test',
      port: 5001,
      protocol: 'http'
    })
  })

  it('Should attempt to store the data', async () => {
    StorageAgent.ipfs = {
      addJSON: async (data, callback) => {
        expect(data).to.equal(testData)
        return callback(null, testDataHash)
      }
    }
    expect(await StorageAgent.storeJSON(testData)).to.equal(testDataHash)
  })

  it('Should throw error if storing data failed', async () => {
    StorageAgent.ipfs = {
      addJSON: async (data, callback) => {
        return callback('error', null)
      }
    }
    await expect(StorageAgent.storeJSON(testData))
      .to.be.rejected
  })

  it('Should throw provided data is not JSON,', async () => {
    await expect(StorageAgent.storeJSON('invalidJSON'))
      .to.be.rejectedWith('JSON expected, received string')
  })

  it('Should retrieve data based on hash', async () => {
    StorageAgent.ipfs = {
      catJSON: (async (hash, callback) => {
        expect(hash).to.equal(testDataHash)
        callback(null, testData)
      })
    }
    expect(await StorageAgent.catJSON(testDataHash)).to.equal(testData)
  })

  it('Should throw error if reading data failed', async () => {
    StorageAgent.ipfs = {
      catJSON: async (hash, callback) => {
        return callback('error', null)
      }
    }
    await expect(StorageAgent.catJSON(testDataHash))
      .to.be.rejected
  })
})
