import { BaseMetadata } from 'cred-types-jolocom-core'
import { Credential } from '../credentials/credential/credential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { IIdentityWalletCreateArgs, IPrivateKeyWithId } from './types'
import { Identity } from '../identity/identity'
import { privateKeyToPublicKey } from '../utils/crypto'
import { ICredentialRequestPayloadCreationAttrs } from '../interactionFlows/credentialRequest/types'
import { JSONWebToken } from '../interactionFlows/JSONWebToken'
import { IAuthPayloadCreationAttrs } from '../interactionFlows/authentication/types'
import { AuthenticationPayload } from '../interactionFlows/authentication/authenticationPayload'
import { CredentialRequestPayload } from '../interactionFlows/credentialRequest/credentialRequestPayload'
import { CredentialResponsePayload } from '../interactionFlows/credentialResponse/credentialResponsePayload'
import { ICredentialResponsePayloadCreationAttrs } from '../interactionFlows/credentialResponse/types'
import { CredentialsReceivePayload } from '../interactionFlows/credentialsReceive/credentialsReceivePayload'
import { ICredentialsReceivePayloadCreationAttrs } from '../interactionFlows/credentialsReceive/types'
import { ICredentialOfferReqPayloadCreationAttrs } from '../interactionFlows/credentialOfferRequest/types'
import { CredentialOfferRequestPayload } from '../interactionFlows/credentialOfferRequest/credentialOfferRequestPayload'

export class IdentityWallet {
  private identityDocument: Identity
  private privateIdentityKey: IPrivateKeyWithId

  public create = {
    credential: Credential.create,
    signedCredential: async <T extends BaseMetadata>({
      metadata,
      claim,
      subject
    }: {
      metadata: T
      claim: typeof metadata['claimInterface']
      subject?: string
    }) => {
      if (!subject) {
        subject = this.getIdentity().getDID()
      }

      return await SignedCredential.create({ metadata, claim, privateIdentityKey: this.privateIdentityKey, subject })
    },
    credentialRequestJSONWebToken: (
      payload: ICredentialRequestPayloadCreationAttrs
    ): JSONWebToken<CredentialRequestPayload> => {
      return JSONWebToken.create({ privateKey: this.privateIdentityKey, payload }) as JSONWebToken<
        CredentialRequestPayload
      >
    },
    credentialResponseJSONWebToken: (
      payload: ICredentialResponsePayloadCreationAttrs
    ): JSONWebToken<CredentialResponsePayload> => {
      return JSONWebToken.create({ privateKey: this.privateIdentityKey, payload }) as JSONWebToken<
        CredentialResponsePayload
      >
    },
    authenticationJSONWebToken: (payload: IAuthPayloadCreationAttrs): JSONWebToken<AuthenticationPayload> => {
      return JSONWebToken.create({ privateKey: this.privateIdentityKey, payload }) as JSONWebToken<
        AuthenticationPayload
      >
    },
    credentialsReceiveJSONWebToken: (
      payload: ICredentialsReceivePayloadCreationAttrs
    ): JSONWebToken<CredentialsReceivePayload> => {
      return JSONWebToken.create({
        privateKey: this.privateIdentityKey,
        payload
      }) as JSONWebToken<CredentialsReceivePayload>
    },
    credentialOfferRequestJSONWebToken: (
      payload: ICredentialOfferReqPayloadCreationAttrs
    ): JSONWebToken<CredentialOfferRequestPayload> => {
      return JSONWebToken.create({ privateKey: this.privateIdentityKey, payload }) as JSONWebToken<
        CredentialOfferRequestPayload
      >
    }
  }

  public sign = {
    credential: this.signCredential.bind(this)
  }

  public identity

  public static create({ privateIdentityKey, identity }: IIdentityWalletCreateArgs): IdentityWallet {
    const identityWallet = new IdentityWallet()
    const pubKey = privateKeyToPublicKey(privateIdentityKey).toString('hex')
    const entry = identity.getPublicKeySection().find(pubKeySec => pubKeySec.getPublicKeyHex() === pubKey)

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

  public getIdentityKey(): { key: Buffer; id: string } {
    return this.privateIdentityKey
  }

  public async signCredential(credential: Credential): Promise<SignedCredential> {
    const signedCredential = SignedCredential.fromCredential(credential)
    await signedCredential.generateSignature(this.privateIdentityKey)

    return signedCredential
  }
}
