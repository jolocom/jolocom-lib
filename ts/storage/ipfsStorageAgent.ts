import * as ipfsAPI from 'ipfs-api'
import * as dagPB from 'ipld-dag-pb'
import testData from '../../tests/data/identity'

export default class IpfsStorageAgent {
  ipfs: any

  constructor(config : {
    host: string,
    port: number,
    protocol: string
  }) {
    this.ipfs = new ipfsAPI(config)
  }

  storeJSON(data : object) : Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof data !== 'object' || data === null) {
        throw new Error(`JSON expected, received ${typeof data}`)
      }

      const buffData = Buffer.from(JSON.stringify(data))
      return this.ipfs.files.add(buffData, (err, fileHash) => {
        if (err) {
          return reject(err)
        }

        return resolve(fileHash[0].hash)
      })
    })
  }

  catJSON(hash: string) : Promise<object> {
    return new Promise((resolve, reject) => {
      return this.ipfs.files.cat(hash, (err, data) => {
        if (err) {
          return reject(err)
        }
        const parsed = JSON.parse(data.toString('utf8'))
        return resolve(parsed)
      })
    })
  }

  createCredentialObject({credential: credential, dagLinks: dagLinks = []}) : Promise<object> {
    return new Promise((resolve, reject) => {
      return this.ipfs.object.put(credential, dagLinks, (err,node) => {
        if (err) {
          return reject (err)
        }
        return resolve(node)
        })
    })
  }

  getCredentialObject({multihash: multihash, getData: enabled}) : Promise<object> {
    return new Promise((resolve, reject) => {
      return this.ipfs.object.get(multihash, (err, node) => {
        if (err) {
          return reject (err)
        }
        return enabled ? resolve (JSON.parse(node.toJSON().data.toString())) : resolve(node)
      })
    })
  }

  //update DDO with link information
  addLink({ headNode: headNode, claimID: claimID, linkNode: linkNode }) : Promise<object> {
    return new Promise((resolve, reject) => {
      const linkNodeSize = linkNode.toJSON().size
      const linkNodeMultihash = linkNode.toJSON().multihash
      const link = new dagPB.DAGLink(claimID, linkNodeSize, linkNodeMultihash)
      return this.ipfs.object.patch.addLink(headNode.toJSON().multihash, link, (err, modifiedHeadNode) => {
        if (err) {
          return reject(err)
        }
        return resolve(modifiedHeadNode)
      })
    })
  }

 resolveLinkPath({headNodeMultihash: headNodeMultihash, claimID: claimID}) : Promise<object> {
   return new Promise( async (resolve, reject) => {
      const modifiedHeadNode = await this.getCredentialObject({multihash: headNodeMultihash, getData: false})
      const linkPath = 'Links/'+ claimID
      return dagPB.resolver.resolve(modifiedHeadNode.serialized, linkPath, async (error, result) => {
        const data = await this.getCredentialObject({multihash: result.value, getData: true})
        return resolve(data)
      })
    })
  }
}

const config = {
  host: 'localhost',
  port: 5001,
  protocol: 'http'
}

const data0 = {
  credential: new Buffer('some identity stuff'),
  dagLinks:[]
}
const data1 = {
  credential: new Buffer(JSON.stringify(testData.expectedSignedCredential)),
  dagLinks: []
}

const data2 = {
  credential: new Buffer(JSON.stringify(testData.expectedVerifiedCredential)),
  dagLinks: []
}

const ipfs = new IpfsStorageAgent(config)

const wrapper = async () => {

  const node1 = await ipfs.createCredentialObject(data0)
  const node2 = await ipfs.createCredentialObject(data2)
  const node3 = await ipfs.createCredentialObject(data1)

  const modifiedHead = await ipfs.addLink({headNode: node1, claimID:'claimID', linkNode: node2})
  const modifiedHeadNode = await ipfs.addLink({headNode: modifiedHead, claimID: 'claimID2', linkNode: node3})
  const hash = modifiedHeadNode.toJSON().multihash
  const head = await ipfs.getCredentialObject({multihash: hash, getData: false})
  const data = await ipfs.resolveLinkPath({headNodeMultihash: head.toJSON().multihash, claimID: 'claimID2'})
  console.log(data, 'data')
}

wrapper()
