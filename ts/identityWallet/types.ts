import { Identity } from '../identity/identity'

export interface IIdentityWalletCreateArgs {
  privateIdentityKey: Buffer
  identity: Identity
}

export interface IPrivateKeyWithId {
  key: Buffer
  id: string
}
