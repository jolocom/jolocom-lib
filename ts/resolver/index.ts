import {
  DidDocumentResolver,
  DidDocumentValidator,
  ResolutionMap,
  ValidatingDidResolver,
} from './types'
import { IDidDocumentAttrs } from '../identity/didDocument/types'
import { getMethodPrefixFromDid } from '../utils/crypto'
import { IEthereumConnector } from '../ethereum/types'
import { IIpfsConnector } from '../ipfs/types'
import { jolocomEthereumResolver } from '../ethereum/ethereum'
import { jolocomIpfsStorageAgent } from '../ipfs/ipfs'
import {noValidation} from '../validation/validation'

/**
 * Function for assembling a resolver to be used as a {@link ValidatingDidResolver} in the {@link MultiResolver}.
 * @param resolver - {@link DidDocumentResolver} function to use
 * @param validator - {@link DidDocumentValidator} function to use
 * @returns configured {@link DidDocumentResolver}
 */

export const createValidatingResolver: ValidatingDidResolver = (
  resolver,
  validator,
) => async (did: string): Promise<IDidDocumentAttrs> => {
  const didDocument = await resolver(did)
  const valid = await validator(didDocument)
  if (!valid) {
    throw new Error('DID Document validation failed')
  }
  return didDocument
}

/**
 * Creates a configurable Jolocom {@link DidDocumentResolver}
 * @param ethereumConnector - Instance of an Ethereum connector to interface with Ethereum
 * @param ipfsConnector - Instance of IPFS connector to interface with IPFS
 * @returns DidDocumentResolver configured to resolve identities according to the Jolocom method spec
 */

export const createJolocomResolver = (
  ethereumConnector: IEthereumConnector = jolocomEthereumResolver,
  ipfsConnector: IIpfsConnector = jolocomIpfsStorageAgent,
): DidDocumentResolver => async (did: string) => {
  const didDocumentHash = await ethereumConnector.resolveDID(did)

  if (!didDocumentHash) {
    throw new Error('No record for DID found.')
  }

  /** @TODO Use an http agent, so that ipfsConnector.catJSON<IDidDocumentAttrs>() can be used */
  return ipfsConnector.catJSON(didDocumentHash) as Promise<IDidDocumentAttrs>
}

/**
 * Default {@link ValidatingDidResolver} used for `did:jolo` DIDs
 */

export const validatingJolocomResolver = createValidatingResolver(createJolocomResolver(), noValidation)

/**
 * @description Class aggregating multiple {@link ValidatingDidResolver}, and delegating
 *   based on the did method prefix
 * @TODO ship with default resolution map and ensure it can't be overwritten,
 *   blocked by decoupling the did:jolo prefix from internal library functionidentity creation functionss
 */
export class MultiResolver {
  private readonly _resolutionMap: ResolutionMap

  constructor(resolvers: ResolutionMap) {
    this._resolutionMap = {
      ...resolvers,
      ...this.resolutionMap,
    }
  }

  /**
   * Get the {@link ResolutionMap} used by the resolver
   * @example multiResolver.resolutionMap // {'jolo': [Function], 'ethr': [Function], ...}
   */

  public get resolutionMap() {
    return this._resolutionMap
  }

  /**
   * Get the methods supported by the resolver
   * @example multiResolver.supportedMethods // ['jolo', 'ethr', ...]
   */

  public get supportedMethods() {
    return Object.keys(this._resolutionMap)
  }

  /**
   * Attempts to resolve a did by delegating to a resolver from the {@link ResolutionMap}
   * @param did
   * @example resolver.resolve('did:jolo:aaa...aaa') // Did Document JSON
   */

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

export const multiResolver = new MultiResolver({
  jolo: createValidatingResolver(
    createJolocomResolver(jolocomEthereumResolver, jolocomIpfsStorageAgent),
    noValidation,
  ),
})
