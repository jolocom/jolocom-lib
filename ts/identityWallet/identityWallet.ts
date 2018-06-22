import { DidDocument } from '../identity/didDocument';
import { Credential } from '../credentials/credential/credential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { SignedCredentialRequest } from '../credentialRequest/signedCredentialRequest/signedCredentialRequest';
import { CredentialRequest } from '../credentialRequest/credentialRequest';
import { IIdentityWallet } from './types';

export class IdentityWallet implements IIdentityWallet {
  private privateIdentityKey: Buffer
  // TODO: change to be an instance of Identity class
  private identity: DidDocument

  public static create(
    {privateIdentityKey, identity}: {privateIdentityKey: Buffer, identity: DidDocument}
  ): IdentityWallet {
    const identityWallet = new IdentityWallet()
    identityWallet.privateIdentityKey = privateIdentityKey
    identityWallet.identity = identity
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
    credential: this.signCredential,
    credentialRequest: this.signCredentialRequest
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

  public signCredentialRequest(credentialRequest: CredentialRequest): SignedCredentialRequest {
    const signedCredRequest = SignedCredentialRequest.create(
      {credentialRequest, privateKey: this.privateIdentityKey}
    )

    signedCredRequest.sign(this.privateIdentityKey)

    return signedCredRequest
  }
}
