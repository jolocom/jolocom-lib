import { DidDocument } from '../identity/didDocument';

export class IdentityWallet {
  private privateIdentityKey: Buffer
  private DidDocument: DidDocument

  public static create(privateIdentityKey: Buffer): IdentityWallet {
    const identityWallet = new IdentityWallet()
    identityWallet.privateIdentityKey = privateIdentityKey

    return identityWallet
  }
  
}