import IpfsWrapper from 'ipfs-wrapper'

export default class IpfsStorageAgent {
  ipfs: any

  constructor(config : { host: string, }) {
    this.ipfs = new IpfsWrapper(config)
  }

  async storeJSON(data : object) : Promise<string> {
    if (typeof data !== 'object' || data === null) {
      throw new Error(`JSON expected, received ${typeof data}`)
    }

    const hash = await this.ipfs.add(JSON.stringify(data))
    return hash
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
