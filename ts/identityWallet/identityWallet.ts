import { Credential } from '../credentials/credential/credential'
import { ICredentialCreateAttrs } from '../credentials/credential/types'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { IIdentityWalletCreateArgs, IPrivateKeyWithId } from './types'
import { Identity } from '../identity/identity'
import { privateKeyToPublicKey } from '../utils/crypto'
import { ICredentialRequestPayloadAttrs } from '../interactionFlows/credentialRequest/types'
import { JSONWebToken } from '../interactionFlows/jsonWebToken'

export class IdentityWallet {
  private identityDocument: Identity
  private privateIdentityKey: IPrivateKeyWithId

  public create = {
    credential: Credential.create,
    signedCredential: async (credentialAttrs: ICredentialCreateAttrs) => {
      if (!credentialAttrs.claim.id) {
        credentialAttrs.claim.id = this.identityDocument.getDID()
      }

      return await SignedCredential.create({ credentialAttrs, privateIdentityKey: this.privateIdentityKey })
    },
    credentialRequestJSONWebToken: (payload: ICredentialRequestPayloadAttrs) => {
      return JSONWebToken.create({privateKey: this.privateIdentityKey, payload})
    }
  }

  public sign = {
    credential: this.signCredential.bind(this),
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
}
