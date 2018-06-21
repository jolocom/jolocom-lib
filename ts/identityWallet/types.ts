import { DidDocument } from '../identity/didDocument';

export interface IIdentityWallet {
  getDidDocument: () => DidDocument
  setDidDocument: (didDocument: DidDocument) => void
  getPrivateIdentityKey: () => Buffer
  setPrivateIdentityKey: (privateIdentityKey: Buffer) => void
}
