import { DidDocument } from '../identity/didDocument';
import { Credential } from '../credentials/credential/credential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { SignedCredentialRequest } from '../credentialRequest/signedCredentialRequest/signedCredentialRequest';
import { CredentialRequest } from '../credentialRequest/credentialRequest';

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
    credentialRequest: CredentialRequest.create,
    signedCredential: (credentialAttrs) => SignedCredential.create({
      credentialAttrs,
      privateIdentityKey: this.privateIdentityKey
    }),
    signedCredentialRequest: SignedCredentialRequest.create
  }

  public sign = {
    credential: this.signCredential
  }

  // TODO: change to be an instance of Identity class
  public getIdentity(): DidDocument {
    return this.identity
  }

  public setIdentity(identity: DidDocument): void {
    this.identity = identity
  }

  public async signCredential(credential: Credential): Promise<SignedCredential> {
    const signedCred = SignedCredential.fromCredential(credential)

    signedCred.setIssuer(this.identity.getDID())
    signedCred.setIssued(new Date())
    await signedCred.generateSignature(this.privateIdentityKey)

    return signedCred
  }
}
