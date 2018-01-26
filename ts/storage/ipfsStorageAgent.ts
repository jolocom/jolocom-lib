import * as ipfsAPI from 'ipfs-mini'

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

      return this.ipfs.addJSON(data, (err, fileHash) => {
        if (err) {
          return reject(err)
        }

        return resolve(fileHash)
      })
    })
  }

  catJSON(hash: string) : Promise<object> {
    return new Promise((resolve, reject) => {
      return this.ipfs.catJSON(hash, (err, data) => {
        if (err) {
          return reject(err)
        }

        return resolve(data)
      })
    })
  }
}
