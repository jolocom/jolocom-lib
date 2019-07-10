import EthereumResolver, { IdentityData } from 'jolocom-registry-contract'
import {
  IEthereumConnector,
  IEthereumResolverConfig,
  IEthereumResolverUpdateDIDArgs,
} from './types'
import { ethers } from 'ethers'

/**
 * @class
 * Class abstracting all interactions with the registry smart contract
 * @internal
 */

export class EthResolver implements IEthereumConnector {
  private ethResolver: EthereumResolver

  /**
   * @constructor
   * @param config - Configuration to connect to a remote Ethereum node, and the address of the registry contract
   */

  public constructor(config: IEthereumResolverConfig) {
    this.ethResolver = new EthereumResolver(
      config.contractAddress,
      config.providerUrl,
    )
  }

  /**
   * Returns a reference to the did document given the did or an empty string
   * @param did - Did to resolve
   * @example `console.log(await resolver.resolveDid('did:jolo:...')) // 'QmZCEmf...'`
   */

  /*  @TODO - This should throw an error, or return false in case no record is found */
  public async resolveDID(did: string): Promise<IdentityData> {
    const data = await this.ethResolver.resolveDID(did)
    return {
      ...data,
      owner:
        data.owner !== '0x'
          ? ethers.utils.computePublicKey('0x04' + data.owner.slice(2), true)
          : '',
    }
  }

  /**
   * Updates the mapping in the smart contract to reference a new pointer
   * @deprecated - Will be deprecated in next major release to avoid relying on private keys in the codebase
   * @param ethereumKey - Ethereum private key to sign the transaction
   * @param did - DID to update
   * @param owner - Public key of the owner of the DID
   * @param newHash - New IPFS hash to associate with the DID
   * @example `await resolver.updateDIDRecord({ethereumKey: Buffer.from('...'), did: 'did:jolo:...', owner: '0x3f2a2123...', newHash: 'QmZCEmf...'})`
   */

  public async updateDIDRecord({
    ethereumKey,
    did,
    owner,
    newHash,
  }: IEthereumResolverUpdateDIDArgs): Promise<void> {
    const uncompressedKey =
      '0x' + ethers.utils.computePublicKey(owner, false).slice(4)
    await this.ethResolver.updateIdentity(
      ethereumKey,
      did,
      uncompressedKey,
      newHash,
    )
  }

  public async getCreated(did: string): Promise<Date> {
    return await this.ethResolver.getCreated(did)
  }
  public async getUpdated(did: string): Promise<Date> {
    return await this.ethResolver.getUpdated(did)
  }
}

/* Instantiates a resolver using the default configuration */

export const jolocomEthereumResolver = new EthResolver({
  providerUrl: 'https://rinkeby.infura.io/',
  contractAddress: '0x4481afd2EbA586dcF002968F6a8e8b7A5C1fF78e',
})
