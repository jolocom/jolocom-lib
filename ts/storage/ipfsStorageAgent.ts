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

  createCredentialObject({ credential, dagLinks = [] } : { credential: Buffer, dagLinks: any }) : Promise<object> {
    return new Promise((resolve, reject) => {
      return this.ipfs.object.put(credential, dagLinks, (err,node) => {
        if (err) {
          return reject (err)
        }
        return resolve(node)
        })
    })
  }

  getCredentialObject({ multihash, getData } : { multihash: string, getData: boolean}) : Promise<object> {
    return new Promise((resolve, reject) => {
      return this.ipfs.object.get(multihash, (err, node) => {
        if (err) {
          return reject (err)
        }
        return getData ? resolve (JSON.parse(node.toJSON().data.toString())) : resolve(node)
      })
    })
  }

  addLink({ headNodeMultihash, claimID, linkNode } : { headNodeMultihash: string,  claimID : string, linkNode : any }) : Promise<object> {
    return new Promise((resolve, reject) => {
      const linkNodeSize = linkNode.toJSON().size
      const linkNodeMultihash = linkNode.toJSON().multihash
      const link = new dagPB.DAGLink(claimID, linkNodeSize, linkNodeMultihash)
      return this.ipfs.object.patch.addLink(headNodeMultihash, link, (err, modifiedHeadNode) => {
        if (err) {
          return reject(err)
        }
        return resolve(modifiedHeadNode)
      })
    })
  }

  resolveLinkPath({ headNodeMultihash, claimID } : { headNodeMultihash: string, claimID: string }) : Promise<object> {
   return new Promise( async (resolve, reject) => {
      const modifiedHeadNode = await this.getCredentialObject({multihash: headNodeMultihash, getData: false})
      const linkPath = 'Links/'+ claimID
      return dagPB.resolver.resolve(modifiedHeadNode.serialized, linkPath, async (err, result) => {
        if (err) {
          return reject(err)
        }
        const data = await this.getCredentialObject({multihash: result.value, getData: true})
        return resolve(data)
      })
    })
  }
}
