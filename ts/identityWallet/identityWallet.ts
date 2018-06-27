import { DidDocument } from '../identity/didDocument';
import { Credential } from '../credentials/credential/credential';
import { ICredentialCreateAttrs } from '../credentials/credential/types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { SignedCredentialRequest } from '../credentialRequest/signedCredentialRequest/signedCredentialRequest';
import { CredentialRequest } from '../credentialRequest/credentialRequest';
import { IIdentityWallet, IIdentityWalletCreateArgs } from './types';
import { Identity } from '../identity/identity';

export class IdentityWallet implements IIdentityWallet {
  private privateIdentityKey: Buffer
  private identityDocument: Identity

  public static create({ privateIdentityKey, identity }: IIdentityWalletCreateArgs): IdentityWallet {
    const identityWallet = new IdentityWallet()
    identityWallet.privateIdentityKey = privateIdentityKey
    identityWallet.identityDocument = identity

    return identityWallet
  }

  public create = {
    credential: Credential.create,
    credentialRequest: CredentialRequest.create,
    signedCredential: async (credentialAttrs: ICredentialCreateAttrs) =>
      await SignedCredential.create({ credentialAttrs, privateIdentityKey: this.privateIdentityKey }),
    signedCredentialRequest: (credentialRequest: CredentialRequest) =>
      SignedCredentialRequest.create({ credentialRequest, privateKey: this.privateIdentityKey})
  }

  public sign = {
    credential: this.signCredential.bind(this),
    credentialRequest: this.signCredentialRequest.bind(this)
  }

  public identity = {
    publicProfile: this.identityDocument.publicProfile
  }

  public getIdentity(): Identity {
    return this.identityDocument
  }

  public setIdentity(identity: Identity): void {
    this.identityDocument = identity
  }

  public async signCredential(credential: Credential): Promise<SignedCredential> {
    const signedCredential = SignedCredential.fromCredential(credential)
    await signedCredential.generateSignature(this.privateIdentityKey)

    return signedCredential
  }

  public signCredentialRequest(credentialRequest: CredentialRequest): SignedCredentialRequest {
    const signedCredRequest = SignedCredentialRequest
      .create({ credentialRequest, privateKey: this.privateIdentityKey })
    signedCredRequest.sign(this.privateIdentityKey)

    return signedCredRequest
  }
}
