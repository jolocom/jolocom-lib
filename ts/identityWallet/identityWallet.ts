import { DidDocument } from '../identity/didDocument';

export class IdentityWallet {
  private privateIdentityKey: Buffer
  // TODO: change to be an instance of Identity class
  private identity: DidDocument

  public static create(privateIdentityKey: Buffer): IdentityWallet {
    const identityWallet = new IdentityWallet()
    identityWallet.privateIdentityKey = privateIdentityKey
    return identityWallet
  }

  // TODO: change to be an instance of Identity class
  public getIdentity(): DidDocument {
    return this.identity
  }

  public setIdentity(identity: DidDocument): void {
    this.identity = identity
  }
}
