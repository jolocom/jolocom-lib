import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import * as proxyquire from 'proxyquire'
import IpfsStorageAgent from '../ts/storage/ipfsStorageAgent'
import * as sinon from 'sinon'
import * as dagPB from 'ipld-dag-pb'
import data from '../tests/data/identity'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('IpfsStorageAgent', () => {
  let StorageAgent
  const testData = {value: 'test'}
  const testDataHash = 'QmTEST'
  const testCredentialData = {value: Buffer.from(JSON.stringify(data.expectedSignedCredential))}
  const testCredentialHash = 'QmCredTest'
  const testCredentialNode = {data: Buffer.from('{"testCredData": 1111}'), size: 10, links: [], multihash: 'QmNode'}
  const testClaimID = '1111'
  const testLinkNode = {data: Buffer.from('data'), size: 10, links: [], multihash: 'QmLink'}
  const resolvedHash = {value: 'QmResolvedHash', remainderPath: ''}
  const resolvedData = {testCredData: 1111}
  const resolver = dagPB.resolver

  testLinkNode.toJSON = sinon.stub().returns(testLinkNode)
  testCredentialNode.toJSON = sinon.stub().returns(testCredentialNode)
  testCredentialNode.serialized = 'serializedTestCredentialNode'

    beforeEach(() => {
      StorageAgent = new IpfsStorageAgent({
        host: 'localhost',
        port: 5001,
        protocol: 'http'
      })
    })

    it('Should attempt to store the data', async () => {
      StorageAgent.ipfs = {
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

    it('Should create a credential object from credential passed in as a buffer', async () => {
      StorageAgent.ipfs = {
        object: {
          put: (credential, dagLinks, callback) => {
            expect(credential).to.equal(testCredentialData)
            const result = testCredentialNode
            return callback(null, result)
          }
        }
      }
      expect(await StorageAgent.createCredentialObject({credential: testCredentialData})).to.equal(testCredentialNode)
    })

    it('Should throw error if creating credential object failed', async () => {
        StorageAgent.ipfs = {
          object: {
            put: (credential, dagLinks, callback) => {
              return callback('error', null)
          }
        }
      }

      await expect(StorageAgent.createCredentialObject({credential: testCredentialData}))
        .to.be.rejected
    })

    it('Should retrieve a credential object from multihash passed in as a string', async () => {
      StorageAgent.ipfs = {
        object: {
          get: (multihash, callback) => {
            expect(multihash).to.equal(testCredentialHash)
            const result = testCredentialNode
            return callback(null, result)
          }
        }
      }
      expect(await StorageAgent.getCredentialObject({multihash: testCredentialHash, getData: false})).to.equal(testCredentialNode)
      expect(await StorageAgent.getCredentialObject({multihash: testCredentialHash, getData: true})).to.deep.equal(JSON.parse(testCredentialNode.data))
    })

    it('Should throw error if retrieving a credential object failed', async () => {
      StorageAgent.ipfs = {
        object: {
          get: (multihash, callback) => {
            return callback('error', null)
          }
        }
      }
      await expect(StorageAgent.getCredentialObject({multihash: testCredentialHash, getData: true})).to.be.rejected
    })

    it('Should add a new link to a Credential Object by passing in the head and link nodes as well as a claim ID to be the link name', async () => {
      StorageAgent.ipfs = {
        object: {
          patch: {
            addLink: (multihash, link, callback) => {
              expect(multihash).to.equal(testCredentialHash)
              expect(link.name).to.equal(testClaimID)
              expect(link.size).to.equal(testLinkNode.size)
              const result = testCredentialNode
              return callback(null, result)
            }
          }
        }
      }
      expect(await StorageAgent.addLink({headNode: testCredentialHash, claimID: testClaimID, linkNode: testLinkNode})).to.equal(testCredentialNode)
    })

    it('Should throw error if adding link failed', async () => {
      StorageAgent.ipfs = {
        object: {
          patch: {
            addLink: (multihash, link, callback) => {
              return callback('error', null)
            }
          }
        }
      }
      await expect(StorageAgent.addLink({headNode: testCredentialNode, claimID: testClaimID, linkNode: testLinkNode})).to.be.rejected
    })

    it('Should resolve a link path from passed-in multihash of the head object and the name of the claim (claimID) to be retrieved', async () => {

      StorageAgent.ipfs = {
        object: {
          get: (multihash, callback) => {
            const result = testCredentialNode
            return callback(null, result)
          }
        }
      }
      const resolver = sinon.stub(dagPB.resolver, 'resolve').yields(null, 'resolvedHash')

      expect(await StorageAgent.resolveLinkPath({headNodeMultihash: testCredentialHash, claimID: testClaimID})).to.deep.equal(resolvedData)
      resolver.restore()
    })

    it('Should throw error if resolving link failed', async () => {

      StorageAgent.ipfs = {
        object: {
          get: (multihash, callback) => {
            const result = testCredentialNode
            return callback(null, result)
          }
        }
      }

      sinon.stub(dagPB.resolver, 'resolve').yields(Error(), null)

      await expect(StorageAgent.resolveLinkPath({headNodeMultihash: testCredentialHash, claimID: testClaimID})).to.be.rejected
    })
  })
