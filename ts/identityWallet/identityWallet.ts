import { BaseMetadata } from 'cred-types-jolocom-core'
import { Credential } from '../credentials/credential/credential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { IIdentityWalletCreateArgs } from './types'
import { Identity } from '../identity/identity'
import { JSONWebToken, JWTEncodable } from '../interactionFlows/JSONWebToken'
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
import { IVaultedKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { IKeyMetadata, ISignedCredCreationArgs } from '../credentials/signedCredential/types'

/*
 * Developer facing class with initialized instance of the key provider as member.
 * Encapsulates functionality related to creating and signing credentials and
 * interaction tokens
 */

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

  /*
   * @constructor
   * @param identity - Instance of identity class, contains did document and public profile
   * @param publicKeyMetadata - Public key id and derivation path
   * @param vaultedKeyProvider - Vaulted key store for generating signatures
   * @returns {Object} - Instance of class
   */

  constructor({ identity, publicKeyMetadata, vaultedKeyProvider }: IIdentityWalletCreateArgs) {
    this.identity = identity
    this.publicKeyMetadata = publicKeyMetadata
    this.vaultedKeyProvider = vaultedKeyProvider
  }

  /*
   * @description - Creates and signs a verifiable credential
   * @param params - Credential creation attributes, including claim, context, subject
   * @param pass - Password to decrypt the vaulted seed
   * @returns {Object} -  Instance of SignedCredential class
  */

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

  /*
   * @description - Creates and signs an authentication request / response
   * @param authArgs - Authentication  creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @returns {Object} -  Instance of Authentication class
  */

  private createAuth = async (authArgs: IAuthenticationAttrs, pass: string) => {
    const authenticationReq = Authentication.fromJSON(authArgs)
    const jwt = JSONWebToken.fromJWTEncodable(authenticationReq)
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)
  }

  /*
   * @description - Creates and signs a credential offer request / response
   * @param credOffer - Credential offer creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @returns {Object} -  Instance of CredentialOffer class
  */

  private createCredOffer = async (credOffer: ICredentialOfferCreationAttrs, pass: string) => {
    const offer = CredentialOffer.fromJSON(credOffer)
    const jwt = JSONWebToken.fromJWTEncodable(offer)
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)
  }

  /*
   * @description - Creates and signs a crededential request
   * @param credReq - Credential request creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @returns {Object} -  Instance of CredentialRequest class
  */

  private createCredReq = async (credReq: ICredentialRequestCreationAttrs, pass: string) => {
    const credentialRequest = CredentialRequest.fromJSON(credReq)
    const jwt = JSONWebToken.fromJWTEncodable(credentialRequest)
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)
  }

  /*
   * @description - Creates and signs a credential response
   * @param credResp - Credential response creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @returns {Object} -  Instance of credential response class
  */

  private createCredResp = async (credResp: ICredentialResponseAttrs, pass: string) => {
    const credentialResponse = CredentialResponse.fromJSON(credResp)
    const jwt = JSONWebToken.fromJWTEncodable(credentialResponse)
    return this.initializeAndSign(jwt, this.publicKeyMetadata.derivationPath, pass)
  }

  /*
   * @description - Creates and signs a credential response
   * @param credResp - Credential response creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @returns {Object} -  Instance of credential response class
  */

  private async initializeAndSign<T extends JWTEncodable>(jwt: JSONWebToken<T>, derivationPath: string, pass: string) {
    jwt.setTokenIssuer(this.getKeyId())
    jwt.setTokenType(InteractionType.CredentialRequest)

    const signature = await this.vaultedKeyProvider.signDigestable({ derivationPath, encryptionPass: pass }, jwt)
    jwt.setSignature(signature.toString('hex'))

    return jwt
  }

  /* Gathering creation methods in an easier to use public interface */

  public create = {
    credential: Credential.create,
    signedCredential: this.createSignedCred,
    interactionTokens: {
      request: {
        auth: this.createAuth,
        offer: this.createCredOffer,
        share: this.createCredReq
      },
      response: {
        auth: this.createAuth,
        offer: this.createCredOffer,
        share: this.createCredResp
      }
    }
  }
}
