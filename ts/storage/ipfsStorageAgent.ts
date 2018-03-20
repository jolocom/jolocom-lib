import * as ipfsAPI from 'ipfs-api'

export default class IpfsStorageAgent {
  ipfs: any

  constructor(config : {
    host: string,
    port: number,
    protocol: string
  }) {
    this.ipfs = new ipfsAPI(config)
  }


  async storeJSON(data : object) : Promise<object> {
    if (typeof data !== 'object' || data === null) {
      throw new Error(`JSON expected, received ${typeof data}`)
    }

    const buffData = Buffer.from(JSON.stringify(data))

    try {
      const fileHash = await this.ipfs.files.add(buffData)
      const pinned = await this.pinHash(fileHash[0].hash)
      return pinned[0].hash
    } catch(err) {
      throw new Error(err)
    }
  }

  async catJSON(hash: string) : Promise<object> {
    try {
      const data = await this.ipfs.files.cat(hash)
      const parsed = JSON.parse(data.toString('utf8'))
      return parsed
    } catch(err) {
      throw new Error(err)
    }
  }

  async pinHash(hash: string) : Promise<object> {
    try {
      const filesPinned = await this.ipfs.pin.add(hash)
      return filesPinned
    } catch(err) {
      throw new Error(err)
    }
  }

  async removePinnedHash(hash: string) : Promise<object> {
    try {
      const filesUnpinned = await this.ipfs.pin.rm(hash)
      return filesUnpinned
    } catch(err) {
      throw new Error(err)
    }
  }
}
