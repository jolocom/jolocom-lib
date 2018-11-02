import { BaseMetadata } from 'cred-types-jolocom-core'
import { Credential } from '../credentials/credential/credential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { IIdentityWalletCreateArgs } from './types'
import { Identity } from '../identity/identity'
import { JSONWebToken, JWTEncodable } from '../interactionFlows/JSONWebToken'
import { IVaultedKeyProvider } from '../crypto/softwareProvider'
import { DidDocument } from '../identity/didDocument'
import { InteractionType } from '../interactionFlows/types'
import { ICredentialOfferCreationAttrs } from '../interactionFlows/credentialOfferRequest/types'
import { CredentialOffer } from '../interactionFlows/credentialOffer'
import { ICredentialRequestCreationAttrs } from '../interactionFlows/credentialRequest/types'
import { IAuthenticationAttrs } from '../interactionFlows/authentication/types'
import { Authentication } from '../interactionFlows/authentication'
import { ICredentialResponseAttrs } from '../interactionFlows/credentialResponse/types'
import { CredentialRequest } from '../interactionFlows/credentialRequest'
import { CredentialResponse } from '../interactionFlows/credentialResponse'

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

  constructor({ identity, publicKeyMetadata, vaultedKeyProvider }: IIdentityWalletCreateArgs) {
    this.identity = identity
    this.publicKeyMetadata = publicKeyMetadata
    this.vaultedKeyProvider = vaultedKeyProvider
  }

  private createSignedCred = async <T extends BaseMetadata>(params: ISignedCredCreationArgs<T>, pass: string) => {
    const { derivationPath } = this.publicKeyMetadata

    const vCred = await SignedCredential.create(
      {
        subject: params.subject || this.getDid(),
        ...params
      },
      {
        keyId: this.publicKeyMetadata.keyId,
        issuerDid: this.getDid()
      }
    )

    const signature = await this.vaultedKeyProvider.signDigestable({ derivationPath, encryptionPass: pass }, vCred)
    vCred.setSignatureValue(signature.toString('hex'))
    return vCred
  }

  private credOfferReq = async (credOffer: ICredentialOfferCreationAttrs, pass: string) => {
    const offer = CredentialOffer.fromJSON(credOffer)
    const jwt = JSONWebToken.fromJWTEncodable(offer)
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)
  }

  private createCredReq = async (credReq: ICredentialRequestCreationAttrs, pass: string) => {
    const credentialRequest = CredentialRequest.fromJSON(credReq)
    const jwt = JSONWebToken.fromJWTEncodable(credentialRequest)
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)
  }

  private createAuth = async (authArgs: IAuthenticationAttrs, pass: string) => {
    const authenticationReq = Authentication.fromJSON(authArgs)
    const jwt = JSONWebToken.fromJWTEncodable(authenticationReq)
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)
  }

  private createOfferResp = async (offerResp: ICredentialOfferCreationAttrs, pass: string) => {
    const authenticationResponse = CredentialOffer.fromJSON(offerResp)
    const jwt = JSONWebToken.fromJWTEncodable(authenticationResponse)
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)
  }

  private createCredResp = async (credentialResp: ICredentialResponseAttrs, pass: string) => {
    const credentialResponse = CredentialResponse.fromJSON(credentialResp)
    const jwt = JSONWebToken.fromJWTEncodable(credentialResponse)
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)
  }

  private async initializeAndSign<T extends JWTEncodable>(jwt: JSONWebToken<T>, derivationPath: string, pass: string) {
    jwt.setTokenIssuer(this.getKeyId())
    jwt.setTokenType(InteractionType.CredentialRequest)

    const signature = await this.vaultedKeyProvider.signDigestable({ derivationPath, encryptionPass: pass }, jwt)
    jwt.setSignature(signature.toString('hex'))

    return jwt
  }

  public create = {
    credential: Credential.create,
    signedCredential: this.createSignedCred,
    interactionTokens: {
      request: {
        auth: this.createAuth,
        offer: this.credOfferReq,
        share: this.createCredReq
      },
      response: {
        auth: this.createAuth,
        offer: this.createOfferResp,
        share: this.createCredResp
      }
    }
  }
}
