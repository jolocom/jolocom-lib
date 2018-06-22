import { DidDocument } from '../identity/didDocument';

export interface IIdentityWallet {
  getIdentity: () => DidDocument
  setIdentity: (identity: DidDocument) => void
}
