import * as FormData from 'form-data'
import * as fetch from 'node-fetch'
import * as dagPB from 'ipld-dag-pb'
import { IIpfsConnector, IIpfsConfig } from './types'

export class IpfsStorageAgent implements IIpfsConnector {

  private endpoint!: string

  public configure(config: IIpfsConfig): void {
    this.endpoint = `${config.protocol}://${config.host}:${config.port}`
  }

  public async storeJSON(data: object, pin: boolean): Promise<string> {
    if (typeof data !== 'object' || data === null) {
      throw new Error(`JSON expected, received ${typeof data}`)
    }

    const endpoint = `${this.endpoint}/api/v0/add?pin=${pin}`
    const formData = new FormData()

    formData.append('file', Buffer.from(JSON.stringify(data)))

    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    }).then((result) => result.json())

    return res.Hash
  }

  public async catJSON(hash: string): Promise<object> {
    const endpoint = `${this.endpoint}/api/v0/cat/${hash}`
    const res = await fetch(endpoint)
    return res.json()
  }

  public async removePinnedHash(hash: string): Promise<void> {
    const endpoint = `${this.endpoint}/api/v0/pin/rm?arg=${hash}`
    const res = await fetch(endpoint)

    if (!res.ok) {
      throw new Error(`Removing pinned hash ${hash} failed, status code: ${res.status}`)
    }
    return res.ok
  }

  public async createDagObject(data: object, pin: boolean): Promise<string> {

    if (typeof data !== 'object' || data === null) {
      throw new Error(`Object expected, received ${typeof data}`)
    }

    const endpoint = `${this.endpoint}/api/v0/dag/put?pin=${pin}`
    const formData = new FormData()

    formData.append('file', Buffer.from(JSON.stringify(data)))
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    })
    .then((result) => result.json())
    const cid = res.Cid
    return cid['/']
  }

  public async resolveIpldPath(pathToResolve: string): Promise<object> {
    const endpoint = `${this.endpoint}/api/v0/dag/get?arg=${pathToResolve}`
    const res = await fetch(endpoint)
    return res.json()
  }

  public async createDagObject(data: string, pin: boolean): Promise<string> {

    if (typeof data !== 'string' || data === null) {
      throw new Error(`String expected, received ${typeof data}`)
    }

    const dataToDagObject = {
        Data: data,
        Links: []
    }

    const endpoint = `${this.endpoint}/api/v0/object/put?pin=${pin}`
    const formData = new FormData()

    formData.append('file', Buffer.from(JSON.stringify(dataToDagObject)))

    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    }).then((result) => result.json())

    return res.Hash
  }

  public async getDagObject(hash: string ): Promise<object> {
    const endpoint = `${this.endpoint}/api/v0/object/get?arg=${hash}`
    const res = await fetch(endpoint)
    return res.json()
  }

  public async getDagObjectData(hash: string ): Promise<string> {
    const endpoint = `${this.endpoint}/api/v0/object/data?arg=${hash}`
    const res = await fetch(endpoint)
    return res.text()
  }

  public async getDagObjectLinks(hash: string ): Promise<string> {
    const endpoint = `${this.endpoint}/api/v0/object/links?arg=${hash}`
    const res = await fetch(endpoint)
    const fullRes = res.json()
    if ( !fullRes.Links ) {
      return 'No available links on this DAG object.'
    } else {
      return fullRes.Links
    }
  }

  // TODO: add typing for DAGNode below
  // tslint:disable-next-line:max-line-length
  // public async addDagLink({ headNodeHash, claimID, linkNodeHash }: { headNodeHash: string, claimID: string, linkNode: any}): Promise<any> {
  //   const link = new dagPB.DAGLink()
  // }
}
