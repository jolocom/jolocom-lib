import * as FormDataNode from 'form-data'
import * as fetchNode from 'node-fetch'
import { IIpfsConnector, IIpfsConfig } from './types'
import { isRunningInNode } from '../utils/general'

export class IpfsStorageAgent implements IIpfsConnector {
  private endpoint: string
  private inNode: boolean

  constructor(config: IIpfsConfig) {
    this.endpoint = `${config.protocol}://${config.host}:${config.port}`
    this.inNode = isRunningInNode()
  }

  public async storeJSON({ data, pin }: { data: object; pin: boolean }): Promise<string> {
    const endpoint = `${this.endpoint}/api/v0/add?pin=${pin}`

    const serializedData = this.serializeJSON(data)
    const { Hash } = await this.postRequest(endpoint, serializedData).then(res => res.json())
    return Hash
  }

  public async catJSON(hash: string): Promise<object> {
    const endpoint = `${this.endpoint}/api/v0/cat/${hash}`
    const res = await this.getRequest(endpoint)
    return res.json()
  }

  public async removePinnedHash(hash: string): Promise<void> {
    const endpoint = `${this.endpoint}/api/v0/pin/rm?arg=${hash}`
    const res = await this.getRequest(endpoint)

    if (!res.ok) {
      throw new Error(`Removing pinned hash ${hash} failed, status code: ${res.status}`)
    }
  }

  public async createDagObject({ data, pin }: { data: object; pin: boolean }): Promise<string> {
    const endpoint = `${this.endpoint}/api/v0/dag/put?pin=${pin}`

    const { Cid } = await this.postRequest(endpoint, data)
    return Cid['/']
  }

  public async resolveIpldPath(pathToResolve: string): Promise<object> {
    const endpoint = `${this.endpoint}/api/v0/dag/get?arg=${pathToResolve}`
    const res = await this.getRequest(endpoint)
    return res.json()
  }

  private async postRequest(endpoint: string, data: object) {
    const fetchImplementation = isRunningInNode() ? fetchNode : window.fetch

    return fetchImplementation(endpoint, {
      method: 'POST',
      body: data
    })
  }

  private async getRequest(endpoint: string) {
    const fetchImplementation = isRunningInNode() ? fetchNode : window.fetch
    return fetchImplementation(endpoint)
  }

  private serializeJSON(data: object) {
    if (!data || typeof data !== 'object') {
      throw new Error(`JSON expected, received ${typeof data}`)
    }

    if (this.inNode) {
      const formData = new FormDataNode()
      formData.append('file', Buffer.from(JSON.stringify(data)))

      return formData
    } else {
      const formData = new FormDataNode()
      const serializedData = Buffer.from(JSON.stringify(data)).toString('binary')
      const dataBlob = new Blob([serializedData], {})

      formData.append('file', dataBlob)
      return formData
    }
  }
}

export const jolocomIpfsStorageAgent = new IpfsStorageAgent({
  host: 'ipfs.jolocom.com',
  port: 443,
  protocol: 'https'
})
