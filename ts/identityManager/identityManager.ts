import { generateMnemonic, deriveChildKeyPair, deriveMasterKeyPairFromMnemonic } from '../utils/keyDerivation'
import { IKeyResponse } from '../utils/keyDerivation'

export enum KeyTypes {
  jolocomIdentityKey = 'm/73\'/0\'/0\'/0',
  ethereumKey = 'm/44\'/60\'/0\'/0/0'
}

export interface IKeyDerivationSchema {
  [key: string]: string
}

export class IdentityManager {
  private seed: Buffer
  private schema: IKeyDerivationSchema

  public static create(seed: Buffer) {
    const identityManager = new IdentityManager()
    identityManager.seed = seed
    identityManager.schema = {
      ...KeyTypes
    }

    return identityManager
  }

  public deriveChildKey(path: string): IKeyResponse {
    const mnemonic = generateMnemonic(this.seed)
    const masterKeyPair = deriveMasterKeyPairFromMnemonic(mnemonic)

    return deriveChildKeyPair({ masterKeyPair, path })
  }

  public getSchema(): IKeyDerivationSchema {
    return this.schema
  }

  public addSchemaEntry({ name, path }: { name: string; path: string }): void {
    this.schema[name] = path
  }
}
