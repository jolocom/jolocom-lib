import { Credential } from '../credentials/credential/credential'
import { ICredentialCreateAttrs } from '../credentials/credential/types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { SignedCredentialRequest } from '../credentialRequest/signedCredentialRequest/signedCredentialRequest'
import { CredentialRequest } from '../credentialRequest/credentialRequest'
import { IIdentityWalletCreateArgs } from './types'
import { Identity } from '../identity/identity'
import { CredentialResponse } from '../credentialResponse/credentialResponse'
import { SignedCredentialResponse } from '../credentialResponse/signedCredentialResponse/signedCredentialResponse'

export class IdentityWallet {
  private privateIdentityKey: Buffer
  private identityDocument: Identity

  public create = {
    credential: Credential.create,
    credentialRequest: CredentialRequest.create,
    credentialResponse: CredentialResponse.create,
    signedCredential: async (credentialAttrs: ICredentialCreateAttrs) =>
      await SignedCredential.create({ credentialAttrs, privateIdentityKey: this.privateIdentityKey }),
    signedCredentialRequest: (credentialRequest: CredentialRequest) =>
      SignedCredentialRequest.create({ credentialRequest, privateKey: this.privateIdentityKey }),
    signedCredentialResponse: (credentialResponse: CredentialResponse) =>
      SignedCredentialResponse.create({ credentialResponse, privateKey: this.privateIdentityKey })
  }

  public sign = {
    credential: this.signCredential.bind(this),
    credentialRequest: this.signCredentialRequest.bind(this)
  }

  public identity

  public static create({ privateIdentityKey, identity }: IIdentityWalletCreateArgs): IdentityWallet {
    const identityWallet = new IdentityWallet()
    identityWallet.privateIdentityKey = privateIdentityKey
    identityWallet.identityDocument = identity
    identityWallet.setIdentity(identity)

    return identityWallet
  }

  public getIdentity(): Identity {
    return this.identityDocument
  }

  private setIdentity(identity: Identity): void {
    this.identity = {
      publicProfile: identity.publicProfile
    }
  }

  public async signCredential(credential: Credential): Promise<SignedCredential> {
    const signedCredential = SignedCredential.fromCredential(credential)
    await signedCredential.generateSignature(this.privateIdentityKey)

    return signedCredential
  }

  public signCredentialRequest(credentialRequest: CredentialRequest): SignedCredentialRequest {
    const signedCredRequest = SignedCredentialRequest.create({ credentialRequest, privateKey: this.privateIdentityKey })
    signedCredRequest.sign(this.privateIdentityKey)

    return signedCredRequest
  }
}
