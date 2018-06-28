import { DidDocument } from '../identity/didDocument';
import { Identity } from '../identity/identity';

export interface IIdentityWallet {
  getIdentity: () => Identity
  setIdentity: (identity: Identity) => void
}

export interface IIdentityWalletCreateArgs {
  privateIdentityKey: Buffer
  identity: Identity
}
