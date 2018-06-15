import { DidDocument } from '../identity/didDocument';

export interface IIdentityWallet {
  getDidDocument: () => DidDocument
  setDidDocument: ({didDocument}: {didDocument: DidDocument}) => void
  getPrivateIdentityKey: () => Buffer
  setPrivateIdentityKey: ({privateIdentityKey}: {privateIdentityKey: Buffer}) => void
}
