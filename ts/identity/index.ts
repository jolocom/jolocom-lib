import IdentityConfig from './types'
import * as keyDerivation from './keyDerivation'
import * as bitcoinjs from 'bitcoinjs-lib'
import DidDocument from './didDocument'

export default class Identity {
  public config: IdentityConfig

  public static initialize(config: IdentityConfig): Identity {
    const identity = new Identity()
    identity.config = config
    return identity
  }

  create(randomStringFromEntropy: string): any {
    const mnemonic = keyDerivation.generateMnemonic(randomStringFromEntropy)
    const masterKeyPair = keyDerivation.deriveMasterKeyPairFromMnemonic(mnemonic)
    const genericSigningKey = keyDerivation.deriveGenericSigningKeyPair(masterKeyPair)
    const ethereumKey = keyDerivation.deriveEthereumKeyPair(masterKeyPair)
    const ddo = new DidDocument(genericSigningKey.getPublicKeyBuffer())

    return {
      mnemonic: mnemonic,
      didDocument: JSON.stringify(ddo),
      masterKeyWIF: masterKeyPair.keyPair.toWIF(),
      genericSigningKeyWIF: genericSigningKey.keyPair.toWIF(),
      ethereumKeyWIF: ethereumKey.keyPair.toWIF()
    }
  }

  register() {}
}
