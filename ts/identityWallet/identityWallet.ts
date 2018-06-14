import { DidDocument } from '../identity/didDocument';

export class IdentityWallet {
  private didDocument: DidDocument

  public getDidDocument(): DidDocument {
    return this.didDocument
  }

  public setDidDocument({didDocument}: {didDocument: DidDocument}): void {
    this.didDocument = didDocument
  }
}
