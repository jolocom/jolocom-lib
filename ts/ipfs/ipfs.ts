import * as FormDataNode from 'form-data'
const fetchNode = require('node-fetch')
import { IIpfsConnector, IIpfsConfig } from './types'
const isNode = require('detect-node')

/**
 * @class
 * Class abstracting all interactions with ipfs nodes
 * @internal
 */
export class IpfsStorageAgent implements IIpfsConnector {
  private _endpoint: string
  private _fetchImplementation = isNode ? fetchNode : window.fetch

  /**
   * Creates an instance of {@link IpfsStorageAgent}
   * @param config - Remote ipfs gateway address
   * @example `const ipfsAgent = new IpfsStorageAgent({protocol: 'https', host: 'test.com', port: 443})`
   */

  constructor(config: IIpfsConfig) {
    this._endpoint = `${config.protocol}://${config.host}:${config.port}`
  }

  /**
   * Get the ipfs gateway endpoint
   * @example `console.log(ipfsAgent.endpoint) // 'https://test.com'`
   */

  get endpoint() {
    return this._endpoint
  }

  /**
   * Set fetch implementation at runtime, helps with tests
   * @param newImplementation - Implementation compliant with the fetch api
   * @example `ipfsAgent.fetchImplementation = customImplementation`
   */

  set fetchImplementation(newImplementation: typeof window.fetch) {
    this._fetchImplementation = newImplementation
  }

  /**
   * Get current fetch implementation
   * @example `console.log(ipfsAgent.fetchImplementation) // function fetch(...)`
   */

  get fetchImplementation(): typeof window.fetch {
    return this._fetchImplementation
  }

  /**
   * Stores a JSON document on IPFS, using a public gateway
   * @param data - JSON document to store
   * @param pin - Whether the hash should be added to the pinset
   * @returns {string} - IPFS hash
   * @example `await ipfsAgent.storeJSON({data: {test: 'test'}, pin: false})`
   */

  public async storeJSON({ data, pin }: { data: object; pin: boolean }): Promise<string> {
    const endpoint = `${this.endpoint}/api/v0/add?pin=${pin}`

    const serializedData = this.serializeJSON(data)
    const { Hash } = await this.postRequest(endpoint, serializedData).then(res => res.json())
    return Hash
  }

  /**
   * Dereferences an IPFS hash and parses the result as json
   * @param hash - IPFS hash
   * @example `console.log(await ipfsAgent.catJSON('QmZC...')) // {test: 'test'}`
   */

  public async catJSON(hash: string): Promise<object> {
    const endpoint = `${this.endpoint}/api/v0/cat/${hash}`
    const res = await this.getRequest(endpoint)
    return res.json()
  }

  /**
   * Removes the specified hash from the pinset
   * @param hash - IPFS hash
   * @example `await ipfsAgent.removePinnedHash('QmZC...')`
   */

  public async removePinnedHash(hash: string): Promise<void> {
    const endpoint = `${this.endpoint}/api/v0/pin/rm?arg=${hash}`
    const res = await this.getRequest(endpoint)

    if (!res.ok) {
      throw new Error(`Removing pinned hash ${hash} failed, status code: ${res.status}`)
    }
  }

  /**
   * Helper method to post data using correct fetch implementation
   * @param endpoint - HTTP endpoint to post data to
   * @param data - JSON document to post
   */

  private async postRequest(endpoint: string, data: BodyInit) {
    return this.fetchImplementation(endpoint, {
      method: 'POST',
      body: data
    })
  }

  /**
   * Helper method to get data using correct fetch implementation
   * @param endpoint - HTTP endpoint to get data from
   */

  private async getRequest(endpoint: string) {
    return this.fetchImplementation(endpoint)
  }

  /**
   * Helper method to serialize JSON so it can be parsed by the go-ipfs implementation
   * @param data - JSON document to be serialized
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

/**
 * Returns a configured instance of the Jolocom ipfs agent
 * @return - Instantiated IPFS agent
 */

export const jolocomIpfsStorageAgent = new IpfsStorageAgent({
  host: 'ipfs.jolocom.com',
  port: 443,
  protocol: 'https'
})
