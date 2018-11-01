import { BaseMetadata } from 'cred-types-jolocom-core'
import { Credential } from '../credentials/credential/credential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { IIdentityWalletCreateArgs } from './types'
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
import { ICredentialOfferResPayloadCreationAttrs } from '../interactionFlows/credentialOfferResponse/types'
import { CredentialOfferRequestPayload } from '../interactionFlows/credentialOfferRequest/credentialOfferRequestPayload'
import { CredentialOfferResponsePayload } from '../interactionFlows/credentialOfferResponse/credentialOfferResponsePayload'
import { IVaultedKeyProvider } from '../crypto/softwareProvider'
import { DidDocument } from '../identity/didDocument'

export interface ISignedCredCreationArgs<T extends BaseMetadata> {
  metadata: T
  claim: T['claimInterface']
  subject: string
}

export interface IKeyMetadata {
  derivationPath: string
  keyId: string
}

export class IdentityWallet {
  private identity: Identity
  private publicKeyMetadata: IKeyMetadata
  private vaultedKeyProvider: IVaultedKeyProvider

  public getDid(): string {
    return this.identity.getDid()
  }

  public getDidDocument(): DidDocument {
    return this.identity.getDidDocument()
  }

  public getIdentity(): Identity {
    return this.identity
  }

  public getKeyReference(): string {
    return this.publicKeyMetadata.derivationPath
  }

  public getKeyId(): string {
    return this.publicKeyMetadata.keyId
  }

  constructor(creationArgs: IIdentityWalletCreateArgs) {
    const { identity, publicKeyMetadata, vaultedKeyProvider } = creationArgs
    this.identity = identity
    this.publicKeyMetadata = publicKeyMetadata
    this.vaultedKeyProvider = vaultedKeyProvider
  }

  private createSignedCred = async <T extends BaseMetadata>(params: ISignedCredCreationArgs<T>, encryptionPass: string) => {
    const { derivationPath } = this.publicKeyMetadata

    const vCred = await SignedCredential.create({
      ...params,
      subject: params.subject || this.getDid(),
      publicKeyMetadata: this.publicKeyMetadata,
      issuerDid: this.getDid()
    })

    const signature = await this.vaultedKeyProvider.signDigestable({ derivationPath, encryptionPass }, vCred)

    vCred.setSignatureValue(signature)

    return vCred
  }

  private createCredReq = (payload: ICredentialRequestPayloadCreationAttrs): JSONWebToken<CredentialRequestPayload> => {
    return JSONWebToken.create(payload, this.getKeyId()) as JSONWebToken<CredentialRequestPayload>
  }

  public create = {
    credential: Credential.create,
    signedCredential: this.createSignedCred,
    interactionTokens: {
      credentialRequest: this.createCredReq
    }
  }

}

//   credentialResponseJSONWebToken: (
//     payload: ICredentialResponsePayloadCreationAttrs
//   ): JSONWebToken<CredentialResponsePayload> => {
//     return JSONWebToken.create({ privateKey: this.privateIdentityKey, payload }) as JSONWebToken<
//       CredentialResponsePayload
//     >
//   },
//   authenticationJSONWebToken: (payload: IAuthPayloadCreationAttrs): JSONWebToken<AuthenticationPayload> => {
//     return JSONWebToken.create({ privateKey: this.privateIdentityKey, payload }) as JSONWebToken<
//       AuthenticationPayload
//     >
//   },
//   credentialsReceiveJSONWebToken: (
//     payload: ICredentialsReceivePayloadCreationAttrs
//   ): JSONWebToken<CredentialsReceivePayload> => {
//     return JSONWebToken.create({
//       privateKey: this.privateIdentityKey,
//       payload
//     }) as JSONWebToken<CredentialsReceivePayload>
//   },
//   credentialOfferRequestJSONWebToken: (
//     payload: ICredentialOfferReqPayloadCreationAttrs
//   ): JSONWebToken<CredentialOfferRequestPayload> => {
//     return JSONWebToken.create({ privateKey: this.privateIdentityKey, payload }) as JSONWebToken<
//       CredentialOfferRequestPayload
//     >
//   },
//   credentialOfferResponseJSONWebToken: (
//     payload: ICredentialOfferResPayloadCreationAttrs
//   ): JSONWebToken<CredentialOfferResponsePayload> => {
//     return JSONWebToken.create({ privateKey: this.privateIdentityKey, payload }) as JSONWebToken<
//       CredentialOfferResponsePayload
//     >
//   }
// }

// public sign = {
//   credential: this.signCredential.bind(this)
// }
