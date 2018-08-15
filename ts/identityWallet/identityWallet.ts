import { Credential } from '../credentials/credential/credential'
import { ICredentialCreateAttrs } from '../credentials/credential/types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { SignedCredentialRequest } from '../credentialRequest/signedCredentialRequest/signedCredentialRequest'
import { CredentialRequest } from '../credentialRequest/credentialRequest'
import { IIdentityWalletCreateArgs } from './types'
import { Identity } from '../identity/identity'
import { CredentialResponse } from '../credentialResponse/credentialResponse'
import { privateKeyToPublicKey } from '../utils/crypto'
import { SignedCredentialResponse } from '../credentialResponse/signedCredentialResponse/signedCredentialResponse'

export class IdentityWallet {
  private identityDocument: Identity
  private privateIdentityKey: {
    key: Buffer
    id: string
  }

  public create = {
    credential: Credential.create,
    credentialRequest: CredentialRequest.create,
    credentialResponse: CredentialResponse.create,
    signedCredential: async (credentialAttrs: ICredentialCreateAttrs) => {
      if (!credentialAttrs.claim.id) {
        credentialAttrs.claim.id = this.identityDocument.getDID()
      }

      return await SignedCredential.create({ credentialAttrs, privateIdentityKey: this.privateIdentityKey })
    },
    signedCredentialRequest: (credentialRequest: CredentialRequest) =>
      SignedCredentialRequest.create({ credentialRequest, privateKey: this.privateIdentityKey.key }),
    signedCredentialResponse: (credentialResponse: CredentialResponse) =>
      SignedCredentialResponse.create({ credentialResponse, privateKey: this.privateIdentityKey.key })
  }

  public sign = {
    credential: this.signCredential.bind(this),
    credentialRequest: this.signCredentialRequest.bind(this)
  }

  public identity

  public static create({ privateIdentityKey, identity }: IIdentityWalletCreateArgs): IdentityWallet {
    const identityWallet = new IdentityWallet()
    const pubKey = privateKeyToPublicKey(privateIdentityKey).toString('hex')
    const entry = identity.getPublicKeySection().find((pubKeySec) => pubKeySec.getPublicKeyHex() === pubKey)

    identityWallet.privateIdentityKey = {
      key: privateIdentityKey,
      id: entry.getIdentifier()
    }
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

  public getIdentityKey(): { key: Buffer, id: string } {
    return this.privateIdentityKey
  }

  public async signCredential(credential: Credential): Promise<SignedCredential> {
    const signedCredential = SignedCredential.fromCredential(credential)
    await signedCredential.generateSignature(this.privateIdentityKey)

    return signedCredential
  }

  public signCredentialRequest(credentialRequest: CredentialRequest): SignedCredentialRequest {
    const signedCredRequest = SignedCredentialRequest.create({
      credentialRequest,
      privateKey: this.privateIdentityKey.key
    })
    signedCredRequest.sign(this.privateIdentityKey.key)

    return signedCredRequest
  }
}
