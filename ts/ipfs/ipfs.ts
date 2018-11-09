import * as FormDataNode from 'form-data'
const fetchNode = require('node-fetch')
import { IIpfsConnector, IIpfsConfig } from './types'
const isNode = require('detect-node')

export class IpfsStorageAgent implements IIpfsConnector {
  private endpoint: string
  private fetchImplementation = isNode ? fetchNode : window.fetch

  constructor(config: IIpfsConfig) {
    this.endpoint = `${config.protocol}://${config.host}:${config.port}`
  }

  public getEndpoint(): string {
    return this.endpoint
  }

  /*
   * @description - Method to swap fetch implementation at runtime, helps with tests too
   * @param newImplementation - Implementation compliant with the fetch api
   * @returns {void}
  */

  public changeFetchImplementation(newImplementation: typeof window.fetch) {
    this.fetchImplementation = newImplementation
  }

  /*
   * @description - Stores a JSON document on IPFS, using a public gateway
   * @param data - JSON document to store
   * @param pin - Whether the hash should be added to the pinset
   * @returns {string} - IPFS hash
  */

  public async storeJSON({ data, pin }: { data: object; pin: boolean }): Promise<string> {
    const endpoint = `${this.endpoint}/api/v0/add?pin=${pin}`

    const serializedData = this.serializeJSON(data)
    const { Hash } = await this.postRequest(endpoint, serializedData).then(res => res.json())
    return Hash
  }

  /*
   * @description - Dereferences a JSON document given a IPFS hash
   * @param hash - IPFS multihash
   * @returns {object} - JSON encoded data
  */

  public async catJSON(hash: string): Promise<object> {
    const endpoint = `${this.endpoint}/api/v0/cat/${hash}`
    const res = await this.getRequest(endpoint)
    return res.json()
  }

  /*
   * @description - Removes the specified hash from the pinset
   * @param hash - IPFS multihash
   * @returns {void}
  */

  public async removePinnedHash(hash: string): Promise<void> {
    const endpoint = `${this.endpoint}/api/v0/pin/rm?arg=${hash}`
    const res = await this.getRequest(endpoint)

    if (!res.ok) {
      throw new Error(`Removing pinned hash ${hash} failed, status code: ${res.status}`)
    }
  }

  /*
   * @description - Helper method to post data using correct fetch implementation
   * @param endpoint - HTTP endpoint to post data to
   * @param data - JSON document to post
   * @returns {object} - Response object
  */

  private async postRequest(endpoint: string, data: object) {
    return this.fetchImplementation(endpoint, {
      method: 'POST',
      body: data
    })
  }

  /*
   * @description - Helper method to get data using correct fetch implementation
   * @param endpoint - HTTP endpoint to get data from
   * @returns {object} - Response object
  */

  private async getRequest(endpoint: string) {
    return this.fetchImplementation(endpoint)
  }

  /*
   * @description - Helper method to serialize JSON so it can be parsed by the go-ipfs implementation
   * @param data - JSON document to be serialized
   * @returns {object} - FormData instance with encoded document
  */

  private serializeJSON(data: object) {
    if (!data || typeof data !== 'object') {
      throw new Error(`JSON expected, received ${typeof data}`)
    }

    if (isNode) {
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

/*
   * @description - Returns a configured instance of the Jolocom ipfs agent 
   * @return { Object } - Instantiated IPFS agent
  */

export const jolocomIpfsStorageAgent = new IpfsStorageAgent({
  host: 'ipfs.jolocom.com',
  port: 443,
  protocol: 'https'
})
