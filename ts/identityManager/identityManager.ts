import * as keyDerivation from '../utils/keyDerivation'
import { IKeyResponse } from '../utils/keyDerivation'

export class IdentityManager {
  private seed: string

  public static create({seed}: {seed: string}) {
    const identityManager = new IdentityManager()
    identityManager.seed = seed

    return identityManager
  }

  private deriveMnemonic(): string {
    return keyDerivation.generateMnemonic(this.seed)
  }

  private deriveKey({name}: {name: string}): IKeyResponse {
    const masterKeyPair = keyDerivation
    .deriveMasterKeyPairFromMnemonic(this.deriveMnemonic())

    return keyDerivation.deriveChildKeyPair({masterKeyPair, path: name})
  }
}
