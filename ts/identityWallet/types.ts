import { Identity } from '../identity/identity'

export interface IIdentityWalletCreateArgs {
  privateIdentityKey: Buffer
  identity: Identity
}