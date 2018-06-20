import * as keyDerivation from '../utils/keyDerivation'
import { IKeyResponse } from '../utils/keyDerivation'
import { IIdentityManager } from './types';

// TODO: remove double from index.ts
export enum DefaultKeyTypes {
  jolocomIdentityKey = 'm/73\'/0\'/0\'/0',
  ethereumKey = 'm/44\'/60\'/0\'/0/0'
}

export interface IKeyDerivationSchema {
  [key: string]: string
}

export class IdentityManager implements IIdentityManager {
  private seed: Buffer
  private schema: IKeyDerivationSchema

  public static create({seed}: {seed: Buffer}) {
    const identityManager = new IdentityManager()
    identityManager.seed = seed
    identityManager.schema = {
      ...DefaultKeyTypes
    }

    return identityManager
  }

  private deriveMnemonicFromSeed(): string {
    return keyDerivation.generateMnemonic({seed: this.seed})
  }

  public deriveChildKeys({path}: {path: string}): IKeyResponse {
    const masterKeyPair = keyDerivation
    .deriveMasterKeyPairFromMnemonic({mnemonic: this.deriveMnemonicFromSeed()})

    return keyDerivation.deriveChildKeyPair({masterKeyPair, path})
  }

  public getSchema(): IKeyDerivationSchema {
    return this.schema
  }

  public addSchemaEntry({name, path}: {name: string, path: string}): void {
    this.schema[name] = path
  }
}
