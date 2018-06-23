import { DidDocument } from '../identity/didDocument';
import { Credential } from '../credentials/credential/credential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { SignedCredentialRequest } from '../credentialRequest/signedCredentialRequest/signedCredentialRequest';
import { CredentialRequest } from '../credentialRequest/credentialRequest';
import { IIdentityWallet, IIdentityWalletCreateArgs } from './types';
// TODO: change DidDoc to Identity
export class IdentityWallet implements IIdentityWallet {
  private privateIdentityKey: Buffer
  private identity: DidDocument // Identity

  public static create({ privateIdentityKey, identity }: IIdentityWalletCreateArgs): IdentityWallet {
    const identityWallet = new IdentityWallet()
    identityWallet.privateIdentityKey = privateIdentityKey
    identityWallet.identity = identity

    return identityWallet
  }

  public create = {
    credential: Credential.create,
    credentialRequest: CredentialRequest.create,
    signedCredential: (credentialAttrs) =>
      SignedCredential.create({ credentialAttrs, privateIdentityKey: this.privateIdentityKey }),
    signedCredentialRequest: (credentialRequest) =>
      SignedCredentialRequest.create({ credentialRequest, privateKey: this.privateIdentityKey})
  }

  public sign = {
    credential: this.signCredential,
    credentialRequest: this.signCredentialRequest
  }

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
    const signedCredRequest = SignedCredentialRequest
      .create({ credentialRequest, privateKey: this.privateIdentityKey })
    signedCredRequest.sign(this.privateIdentityKey)

    return signedCredRequest
  }
}
