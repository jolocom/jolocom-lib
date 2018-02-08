import { IConfig } from '../index'
import * as keyDerivation from './keyDerivation'
import * as bitcoinjs from 'bitcoinjs-lib'
import DidDocument from './didDocument'
import IpfsStorageAgent from '../storage/ipfsStorageAgent'
import EthResolver from '../ethereum/ethereumResolver'

/* A wrapper class for creating, storing and registering jolocom Identity
 * Create does not use any of the config values.
 * */
export default class Identity {
  public config: IConfig

  constructor(config: IConfig) {
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
  create(randomStringFromEntropy: string): any {
    const mnemonic = keyDerivation.generateMnemonic(randomStringFromEntropy)
    const masterKeyPair = keyDerivation.deriveMasterKeyPairFromMnemonic(mnemonic)
    const genericSigningKey = keyDerivation.deriveGenericSigningKeyPair(masterKeyPair)
    const ethereumKey = keyDerivation.deriveEthereumKeyPair(masterKeyPair)
    const ddo = new DidDocument(genericSigningKey.getPublicKeyBuffer())

    return {
      mnemonic: mnemonic,
      didDocument: JSON.parse(JSON.stringify(ddo)),
      masterKeyWIF: masterKeyPair.keyPair.toWIF(),
      genericSigningKeyWIF: genericSigningKey.keyPair.toWIF(),
      ethereumKeyWIF: ethereumKey.keyPair.toWIF()
    }
  }

  /* Stores DDO object on IPFS
   * @param {object} ddo - DDO object
   * @returns {string} an IPFS hash under which DDO is stored
   * */
  store(ddo: object) {
    const ipfsAgent = new IpfsStorageAgent(this.config.ipfs)

    return ipfsAgent.storeJSON(ddo).catch(err => {
      throw new Error(`Did document could not be saved. ${err.message}`)
    })
  }

  /* Registers DID and DDO's IPFS hash on Ethereum
   * @param {object} ethereumKey - ethereum key associated with the DDO
   * @param {string} did - did string identifying the ddo
   * @param {string} ipfsHash - where the DDO is stored
   */
  register(ethereumKey: object, did: string, ipfsHash: string) {
    const { contractAddress, providerUrl } = this.config.identity
    const ethereumResolver = new EthResolver(contractAddress, providerUrl)

    return ethereumResolver.updateDIDRecord(ethereumKey, did, ipfsHash)
      .catch(error => { throw new Error(`Could not update Did record. ${error.message}`)})
  }
}
