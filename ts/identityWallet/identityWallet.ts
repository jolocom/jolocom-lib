import { DidDocument } from '../identity/didDocument';
import { Credential } from '../credentials/credential/credential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { CredentialRequest } from '../credentialRequest';

export class IdentityWallet {
  private privateIdentityKey: Buffer
  // TODO: change to be an instance of Identity class
  private identity: DidDocument

  public static create(privateIdentityKey: Buffer): IdentityWallet {
    const identityWallet = new IdentityWallet()
    identityWallet.privateIdentityKey = privateIdentityKey
    return identityWallet
  }

  public create = {
    credential: Credential.create,
    signedCredential: (credentialAttrs) => SignedCredential.create({
      credentialAttrs,
      privateIdentityKey: this.privateIdentityKey
    }),
    credentialRequest: CredentialRequest // include the method after credential request PR is merged
  }

  // TODO: change to be an instance of Identity class
  public getIdentity(): DidDocument {
    return this.identity
  }

  public setIdentity(identity: DidDocument): void {
    this.identity = identity
  }
}
