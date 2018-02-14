import * as ipfsAPI from 'ipfs-api'
import * as dagCBOR from 'ipld-dag-cbor'
import * as dagPB from 'ipld-dag-pb'
import * as ipfsInterface from 'interface-ipfs-core'
import testData from '../../tests/data/identity'

export default class IpfsStorageAgent {
  ipfs: any
  bla: string
  ipldNode: any

  constructor(config : {
    host: string,
    port: number,
    protocol: string
  }) {
    this.ipfs = new ipfsAPI(config)
    this.ipldNode = 'philosophise'
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
        console.log(data, 'here is our data')
        const parsed = JSON.parse(data.toString('utf8'))
        return resolve(parsed)
      })
    })
  }

  //_setupCredentialObject() : Promise<object> {
    //return new Promise((resolve, reject) => {
      //return this.ipfs.object.new('unixfs-dir', (err,node) => {
        //if (err) {
          //return reject (err)
        //}
        //return resolve(node)
      //})
    //})
  //}

  createCredentialObject({data: data, dagLinks: dagLinks}) : Promise<object> {
    return new Promise((resolve, reject) => {
      return dagPB.DAGNode.create(data, dagLinks, (err,node) => {
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
        console.log(node)
        return enabled ? resolve (JSON.parse(node.toJSON().data.toString())) : resolve(node)
      })
    })
  }

  //update DDO with link information
  addLink({ headNode: headNode, linkName: linkName, linkNode: linkNode }) : Promise<object> {
    return new Promise((resolve, reject) => {
      const linkNodeSize = linkNode.toJSON().size
      const linkNodeMultihash = linkNode.toJSON().multihash
      const link = new dagPB.DAGLink(linkName, linkNodeSize, linkNodeMultihash)
      return dagPB.DAGNode.addLink(headNode, link, (err, modifiedHeadNode) => {
        if (err) {
          return reject(err)
        }
        return resolve(modifiedHeadNode)
      })
    })
  }

  async resolveLinkPath({headNodeMultihash: headNodeMultihash, claimID: claimID}) : Promise<object> {
      const modifiedHeadNode = await this.getCredentialObject({multihash: headNodeMultihash, getData: false})
      const linkPath = 'Links/'+ claimID
      console.log(modifiedHeadNode)
      return dagPB.resolver.resolve(modifiedHeadNode.serialized, linkPath, async (error, result) => {
        console.log(result)
        return this.getCredentialObject({multihash: result.value, getData: true})
      })
  }
}

const config = {
  host: 'localhost',
  port: 5001,
  protocol: 'http'
}

const data = {
  data: new Buffer(JSON.stringify(testData.expectedSignedCredential)),
  dagLinks: []
}

const data2 = {
  data: new Buffer(JSON.stringify(testData.expectedVerifiedCredential)),
  dagLinks: []
}
//dagCBOR.util.cid(data, (err, cid) => {
  //console.log(cid, 'cid')
//})
const ipfs = new IpfsStorageAgent(config)

//dagCBOR.util.serialize(data, (err, serialized) => {
  //ipfs.ipldNode = serialized
//})

//ipfs.createCredentialObject(data)
  //.then(node1 => {
    //dagPB.resolver.tree(node1._serialized, (result) => {
      //console.log(result)
    //})
  //})

const wrapper = async () => {

  const node1 = await ipfs.createCredentialObject(data)
  const headNode = node1

  const node2 = await ipfs.createCredentialObject(data2)

  const modifiedHeadNode = await ipfs.addLink({headNode: headNode, linkName:'claimID', linkNode: node2})
  const hash = modifiedHeadNode.toJSON().multihash
  console.log(hash, 'hash')
  const result = await ipfs.resolveLinkPath({headNodeMultihash: hash, claimID: 'claimID'})
  console.log(result)
}

wrapper()
