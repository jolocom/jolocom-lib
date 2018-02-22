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

  /* Creates initial credentials object as directory for further linking
   * of verifiable credentials, updates the DDO credentialsEndpoint with the
   * resulting IPLD hash, updates the Ethereum Registry Contract Record
   * with the new DID/DDO mapping
   * @param {string} data: data that is associated with the identity's credential directory
   * @param {object} ddo: DDO associated with the identity
   * @param {object} ethereumKey -  ethereum key associated with the DDO
   */

  //what do we want to place in this data string?

  async initPublicCredentialsDirectory ({ data, ddo, ethereumKey} : { data: string, ddo: object, ethereumKey: object}) {
    const directoryData = Buffer.from(data)
    const ipfsAgent = new IpfsStorageAgent(this.config.ipfs)
    const directoryNode = await ipfsAgent.createCredentialObject({credential: directoryData}).catch(err => {
      throw new Error(`Could not create credentials directory. ${error.message}`)
    })
    this.updateAndStoreUtil(directoryNode, ddo, ethereumKey)
  }

  /* Stores a publically accessible verifiable credential on IPLD, updates the DDO endpoint
   * and the Ethereum Registry Contract Record with the new DID/DDO mapping
   * @param {object} ethereumKey - ethereum key associated with the DDO
   * @param {object} ddo - DDO associated with the identity
   * @param {any} credential - verifiable credential object
   */
  async storePublicCredential ({ credential, ddo, ethereumKey } : { credential: any, ddo: object, ethereumKey: object}) {
    const credentialBuffer = Buffer.from(JSON.stringify(credential))
    const newClaimID = credential.id
    const endpoint = ddo.credentialsEndpoint
    const ipfsAgent = new IpfsStorageAgent(this.config.ipfs)
    const credentialNode = await ipfsAgent.createCredentialObject({credential: credentialBuffer}).catch(err => {
      throw new Error(`Could not create credentials object. ${err.message}`)
    })
    const newCredentialsDirectory = await ipfsAgent.addLink({headNodeMultihash: endpoint, claimID: newClaimID, linkNode: credentialNode}).catch(err => {
      throw new Error(`Link could not be added. ${err.message}`)
    })
    this.updateAndStoreUtil(newCredentialsDirectory, ddo, ethereumKey)
  }

  /* Retrieves a verifiable credential associated with a DID
   * @param {object} ddo - DDO associated with the identity
   * @param {string} claimID - ID associated with the credential to be retrieved
   * @returns {any} a verified credential which has been retrieved
   */
  retrievePublicCredential ({ddo, claimID} : { ddo: object, claimID: string }) {
    const endpoint = ddo.credentialsEndpoints
    const ipfsAgent = new IpfsStorageAgent(this.config.ipfs)
    return ipfsAgent.resolveLinkPath({headNodeMultihash: endpoint, claimID: claimID})
  }

 /* Updates a DDO with a new endpoint, stores the DDO, updates the Ethereum Registry
  * Contract Record with the new DID/DDO mapping
  * @param {any} newNode - node containing the multihash/new endpoint
  * @param {object} ddo - DDO associated with the identity
  * @param {object} ethereumKey - ethereum key associated with the identity
  */
  updateAndStoreUtil(newNode: any, ddo: object, ethereumKey: object) {
    const ipldHash = newNode.toJSON().multihash
    ddo.credentialsEndpoint = ipldHash

    return this.store(ddo).then(hash => {
      this.register(ethereumKey, ddo.id, hash)
    })
  }
}
