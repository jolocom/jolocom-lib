import {
  DidDocumentResolver,
  DidDocumentValidator,
  ResolutionMap,
} from './types'
import { IDidDocumentAttrs } from '../identity/didDocument/types'
import { getMethodPrefixFromDid } from '../utils/crypto'
import { IEthereumConnector } from '../ethereum/types'
import { IIpfsConnector } from '../ipfs/types'

export const createResolver = (resolver: DidDocumentResolver) => (
  validator: DidDocumentValidator,
): DidDocumentResolver => async (did: string): Promise<IDidDocumentAttrs> => {
  const didDocument = await resolver(did)
  return validator(didDocument).then(valid => {
    if (valid) {
      return didDocument
    }

    /** @TODO what is the best return value here? Perhaps throw error */
    return undefined
  })
}

export const createJolocomResolver = (
  ethereumConnector: IEthereumConnector,
  ipfsConnector: IIpfsConnector,
): DidDocumentResolver => async (did: string) => {
  const didDocumentHash = await ethereumConnector.resolveDID(did)

  if (!didDocumentHash) {
    throw new Error('No record for DID found.')
  }

  /** @TODO Use an http agent, so that ipfsConnector.catJSON<IDidDocumentAttrs>() can be used */
  return ipfsConnector.catJSON(didDocumentHash) as Promise<IDidDocumentAttrs>
}

/**
 * @TODO ship with default resolution map and ensure it can't be overwritten.
 *   blocked by decoupling the did:jolo prefix from identity creation functions
 */
export class MultiResolver {
  private readonly _resolutionMap: ResolutionMap

  constructor(resolvers: ResolutionMap) {
    this._resolutionMap = {
      ...resolvers,
      ...this.resolutionMap,
    }
  }

  public get resolutionMap() {
    return this._resolutionMap
  }

  public get supportedMethods() {
    return Object.keys(this._resolutionMap)
  }

  public resolve(did: string) {
    const methodPrefix = getMethodPrefixFromDid(did)
    const resolver = this._resolutionMap[methodPrefix]

    if (!resolver) {
      throw new Error(
        `Cannot resolve provided method, supported: ${
          this.supportedMethods
        }, provided: ${methodPrefix}`,
      )
    }

    return resolver(did)
  }
}

