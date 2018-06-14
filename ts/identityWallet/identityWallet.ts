import { DidDocument } from '../identity/didDocument';

export class IdentityWallet {
  private didDocument: DidDocument
  private privateIdentityKey: Buffer

  public getDidDocument(): DidDocument {
    return this.didDocument
  }

  public setDidDocument({didDocument}: {didDocument: DidDocument}): void {
    this.didDocument = didDocument
  }

  public getPrivateIdentityKey(): Buffer {
    return this.privateIdentityKey
  }

  public setPrivateIdentityKey({privateIdentityKey: Buffer}): void {
    this.privateIdentityKey = this.privateIdentityKey
  }
}
