import * as ipfsAPI from 'ipfs-api'

export default class IpfsStorageAgent {
  ipfs: any
  bla: string

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
}
