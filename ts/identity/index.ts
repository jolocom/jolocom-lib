import { IConfig } from '../index'
import * as keyDerivation from './keyDerivation'
import * as bitcoinjs from 'bitcoinjs-lib'
import DidDocument from './didDocument'
import IpfsStorageAgent from '../storage/ipfsStorageAgent'

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

  store(ddo: Object) {
    const ipfsAgent = new IpfsStorageAgent(this.config.ipfs)
    return ipfsAgent.storeJSON(ddo)
              .then((result) => { return result })
              .catch((err) => {
                throw new Error("Did document could not be saved. " + err.message)
              })
  }

  register() {}
}
