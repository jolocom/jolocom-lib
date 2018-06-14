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

  public create(randomStringFromEntropy: string): IdentityCreationResponse {
    const mnemonic = keyDerivation.generateMnemonic(randomStringFromEntropy)
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
}
