import { IConfig } from '../index'
import * as keyDerivation from './keyDerivation'
import * as bitcoinjs from 'bitcoinjs-lib'
import DidDocument from './didDocument'
import IpfsStorageAgent from '../storage/ipfsStorageAgent'
import EthResolver from '../ethereum/ethereumResolver'

export default class Identity {
  public config: IConfig

  constructor(config: IConfig) {
    this.config = config
  }

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

  store(ddo: object) {
    const ipfsAgent = new IpfsStorageAgent(this.config.ipfs)

    return ipfsAgent.storeJSON(ddo).catch(err => {
      throw new Error(`Did document could not be saved. ${err.message}`)
    })
  }

  register(ethereumKey: object, did: string, ipfsHash: string) {
    const { contractAddress, providerUrl } = this.config.identity
    const ethereumResolver = new EthResolver(contractAddress, providerUrl)

    return ethereumResolver.updateDIDRecord(ethereumKey, did, ipfsHash)
      .catch(error => { throw new Error(`Could not update Did record. ${error.message}`)})
  }
}
