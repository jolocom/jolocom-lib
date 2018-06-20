import { DidDocument } from './didDocument'
import * as keyDerivation from '../utils/keyDerivation'
import { ILibConfig } from '../types'
import { IIpfsConnector } from '../ipfs/types'
import { IpfsStorageAgent } from '../ipfs'
import { EthResolver } from '../ethereum'
import { IDidDocumentAttrs } from './didDocument/types';

export interface IdentityCreationResponse {
  mnemonic: string,
  didDocument: DidDocument,
  genericSigningKey: keyDerivation.IKeyResponse,
  ethereumKey: keyDerivation.IKeyResponse
}

/* A wrapper class for creating, storing and registering jolocom Identity
 * Create does not use any of the config values.
 * */

export class Identity {
  public config: ILibConfig

  constructor(config: ILibConfig) {
    this.config = config
  }

  /* Creates DID/DDO compliant identity objects and set of cryptographic
   * keys to manage it and a mnemonic needed for keys recovery
   *
   * @param {string} randomStringFromEntropy - a random string generated from
   * entropy.
   * @return {object} containing mnemonic, didDocument, and basic key pairs
   * encoded in WIF format
   * */

  public create(randomStringFromEntropy: Buffer): IdentityCreationResponse {
    const mnemonic = keyDerivation.generateMnemonic({seed: randomStringFromEntropy})
    const masterKeyPair = keyDerivation.deriveMasterKeyPairFromMnemonic(mnemonic)
    const genericSigningKey = keyDerivation.deriveGenericSigningKeyPair(masterKeyPair)
    const ethereumKey = keyDerivation.deriveEthereumKeyPair(masterKeyPair)
    const ddo = new DidDocument().fromPublicKey(genericSigningKey.publicKey)

    return {
      didDocument: ddo,
      ethereumKey,
      genericSigningKey,
      mnemonic
    }
  }

  /* Stores DDO object on IPFS
   * @param {object} ddo - DDO object
   * @returns {string} an IPFS hash under which DDO is stored
  **/

  // TODO IPFS connector should be configured only once
  public async store(ddo: object) {
    const { IpfsConnector:  CustomConnector } = this.config
    const IpfsConnector: IIpfsConnector = CustomConnector ? CustomConnector : new IpfsStorageAgent()

    IpfsConnector.configure(this.config.ipfs)

    return IpfsConnector.storeJSON(ddo, true).catch((err) => {
      throw new Error(`Did document could not be saved. ${err.message}`)
    })
  }

  /* Registers DID and DDO's IPFS hash on Ethereum
   * @param {object} ethereumKey - ethereum key associated with the DDO
   * @param {string} did - did string identifying the ddo
   * @param {string} ipfsHash - where the DDO is stored
   */

  public async register(options: {ethereumKey: object, did: string, ipfsHash: string}): Promise<void> {
    const { contractAddress, providerUrl } = this.config.identity
    const ethereumResolver = new EthResolver(contractAddress, providerUrl)

    const { ethereumKey, did, ipfsHash } = options
    return ethereumResolver.updateDIDRecord(ethereumKey, did, ipfsHash)
      .catch((error) => { throw new Error(`Could not update Did record. ${error.message}`)})
  }

  public async lookup(did: string): Promise<IDidDocumentAttrs> {
    const { contractAddress, providerUrl } = this.config.identity
    const ethereumResolver = new EthResolver(contractAddress, providerUrl)

    const { IpfsConnector:  CustomConnector } = this.config
    const IpfsConnector: IIpfsConnector = CustomConnector ? CustomConnector : new IpfsStorageAgent()
    IpfsConnector.configure(this.config.ipfs)

    const ddoHash = await ethereumResolver.resolveDID(did)
    return await IpfsConnector.catJSON(ddoHash) as IDidDocumentAttrs
  }
}
