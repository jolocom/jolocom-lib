import * as FormData from 'form-data'
import * as fetch from 'node-fetch'
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
  }
}
