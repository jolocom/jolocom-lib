import { BaseMetadata } from 'cred-types-jolocom-core'
import { Credential } from '../credentials/credential/credential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import {
  AuthCreationArgs,
  CredentialOfferRequestCreationArgs,
  CredentialOfferResponseCreationArgs,
  CredentialShareRequestCreationArgs,
  CredentialShareResponseCreationArgs,
  IIdentityWalletCreateArgs,
  PaymentRequestCreationArgs,
  PaymentResponseCreationArgs,
  PublicKeyMap
} from './types'
import { Identity } from '../identity/identity'
import { JSONWebToken, JWTEncodable } from '../interactionTokens/JSONWebToken'
import { InteractionType } from '../interactionTokens/types'
import { CredentialOffer } from '../interactionTokens/credentialOffer'
import { PaymentResponse } from '../interactionTokens/paymentResponse'
import { PaymentRequest } from '../interactionTokens/paymentRequest'
import { Authentication } from '../interactionTokens/authentication'
import { CredentialRequest } from '../interactionTokens/credentialRequest'
import { CredentialResponse } from '../interactionTokens/credentialResponse'
import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import { IVaultedKeyProvider, KeyTypes } from '../vaultedKeyProvider/types'
import {
  IKeyMetadata,
  ISignedCredCreationArgs,
} from '../credentials/signedCredential/types'
import {
  keyIdToDid,
  getIssuerPublicKey,
  handleValidationStatus,
  publicKeyToAddress,
} from '../utils/helper'
import { generateRandomID } from '../utils/crypto'
import { CredentialsReceive } from '../interactionTokens/credentialsReceive'
import { createJolocomRegistry } from '../registries/jolocomRegistry'
import { IRegistry } from '../registries/types'
import {
  IContractsAdapter,
  IContractsGateway,
  ITransactionEncodable,
} from '../contracts/types'

/**
 * @class
 * Developer facing class with initialized instance of the key provider as member.
 * Encapsulates functionality related to creating and signing credentials and
 * interaction tokens
 */

export class IdentityWallet {
  private _identity: Identity
  private _publicKeyMetadata: IKeyMetadata
  private _vaultedKeyProvider: IVaultedKeyProvider
  private _contractsAdapter: IContractsAdapter
  private _contractsGateway: IContractsGateway

  /**
   * Get the did associated with the identity wallet
   * @example `console.log(identityWallet.did) // 'did:jolo:...'`
   */

  get did(): string {
    return this.identity.did
  }

  /**
   * Set the did associated with the identity wallet
   * @example `identityWallet.did = 'did:jolo:...'`
   */

  set did(did: string) {
    this.identity.did = did
  }

  /**
   * Get the {@link Identity} associated wtith the identity wallet
   * @example `console.log(identityWallet.identity) // Identity {...}`
   */

  get identity() {
    return this._identity
  }

  /**
   * Get the {@link Identity} associated wtith the identity wallet
   * @example `identityWallet.identity = Identity.fromDidDocument(...)`
   */

  set identity(identity: Identity) {
    this._identity = identity
  }

  /**
   * Get the {@link DidDocument} associated wtith the identity wallet
   * @example `console.log(identityWallet.didDocument) // DidDocument {...}`
   */

  get didDocument() {
    return this.identity.didDocument
  }

  /**
   * Set the {@link DidDocument} associated wtith the identity wallet
   * @example `identityWallet.didDocument = DidDocument.fromPublicKey(...)`
   */

  set didDocument(didDocument) {
    this.identity.didDocument = didDocument
  }

  /**
   * Get the metadata about the key pair associated wtith the identity wallet
   * @example `console.log(identityWallet.publicKeyMetadata) // {derivationPath: '...', keyId: '...'}`
   */

  get publicKeyMetadata(): IKeyMetadata {
    return this._publicKeyMetadata
  }

  /**
   * Set the metadata about the key pair associated wtith the identity wallet
   * @example `identityWallet.publicKeyMetadata = {derivationPath: '...', keyId: '...'}`
   */

  set publicKeyMetadata(metadata: IKeyMetadata) {
    this._publicKeyMetadata = metadata
  }

  /**
   * Get the vaulted key provider instance associated wtith the identity wallet
   * @example `console.log(identityWallet.vaultedKeyProvider) // SoftwareKeyProvider {...}`
   */

  private get vaultedKeyProvider() {
    return this._vaultedKeyProvider
  }

  /**
   * Get the vaulted key provider instance associated wtith the identity wallet
   * @example `identityWallet.vaultedKeyProvider = new SoftwareKeyProvider(...)`
   */

  private set vaultedKeyProvider(keyProvider: IVaultedKeyProvider) {
    this._vaultedKeyProvider = keyProvider
  }

  /**
   * @constructor
   * @param identity - Instance of {@link Identity} class, containing a {@link DidDocument}
   *   and optionally a public profile {@link SignedCredential}
   * @param publicKeyMetadata - Public key id and derivation path
   * @param vaultedKeyProvider - Vaulted key store for generating signatures
   * @param contractsGateway - Instance of connector to the used smart contract chain
   * @param contractsAdapter - Instance of handler to assemble Transactions for the used smart contract chain
   */

  constructor({
    identity,
    publicKeyMetadata,
    vaultedKeyProvider,
    contractsGateway,
    contractsAdapter,
  }: IIdentityWalletCreateArgs) {
    if (
      !identity ||
      !publicKeyMetadata ||
      !vaultedKeyProvider ||
      !contractsAdapter ||
      !contractsGateway
    ) {
      throw new Error(
        'Missing arguments! Expected identity, publicKeyMetadata, and vaulterKeyProvider',
      )
    }

    this.identity = identity
    this.publicKeyMetadata = publicKeyMetadata
    this.vaultedKeyProvider = vaultedKeyProvider
    this._contractsGateway = contractsGateway
    this._contractsAdapter = contractsAdapter
  }

  /**
   * Creates and signs a {@link SignedCredential}
   * @param params - Credential creation attributes, including claim, context, subject
   * @param pass - Password to decrypt the vaulted seed
   */

  private createSignedCred = async <T extends BaseMetadata>(
    params: ISignedCredCreationArgs<T>,
    pass: string,
  ) => {
    const { derivationPath } = this.publicKeyMetadata

    const vCred = await SignedCredential.create(
      {
        subject: params.subject || this.did,
        ...params,
      },
      {
        keyId: this.publicKeyMetadata.keyId,
        issuerDid: this.did,
      },
    )

    const signature = await this.vaultedKeyProvider.signDigestable(
      { derivationPath, encryptionPass: pass },
      vCred,
    )
    vCred.signature = signature.toString('hex')
    return vCred
  }

  /**
   * Creates and signs an authentication request / response
   * @param authArgs - Authentication  creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - optional received authentication JSONWebToken Class
   */

  private createAuth = async (
    authArgs: AuthCreationArgs,
    pass: string,
    receivedJWT?: JSONWebToken<JWTEncodable>,
  ) => {
    const authenticationReq = Authentication.fromJSON({
      description: 'Authorization required',
      ...authArgs
    })

    const jwt = JSONWebToken.fromJWTEncodable(authenticationReq)
    jwt.interactionType = InteractionType.Authentication
    return this.initializeAndSign(
      jwt,
      this.publicKeyMetadata.derivationPath,
      pass,
      receivedJWT,
    )
  }

  /**
   * Creates and signs a credential offer request / response
   * @param credOffer - Credential offer creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - optional received credential offer JSONWebToken Class
   */

  private createCredOffer = async (
    credOffer: CredentialOfferRequestCreationArgs,
    pass: string,
    receivedJWT?: JSONWebToken<JWTEncodable>,
  ) => {
    const offer = CredentialOffer.fromJSON(credOffer)
    const jwt = JSONWebToken.fromJWTEncodable(offer)
    jwt.interactionType = InteractionType.CredentialOffer
    return this.initializeAndSign(
      jwt,
      this.publicKeyMetadata.derivationPath,
      pass,
      receivedJWT,
    )
  }

  /**
   * Creates and signs a crededential request
   * @param credReq - Credential request creation attributes
   * @param pass - Password to decrypt the vaulted seed
   */

  private createCredReq = async (
    credReq: CredentialShareRequestCreationArgs,
    pass: string,
  ) => {
    const credentialRequest = CredentialRequest.fromJSON(credReq)
    const jwt = JSONWebToken.fromJWTEncodable(credentialRequest)
    jwt.interactionType = InteractionType.CredentialRequest
    return this.initializeAndSign(
      jwt,
      this.publicKeyMetadata.derivationPath,
      pass,
    )
  }

  /**
   * Creates and signs a credential response
   * @param credResp - Credential response creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - received credential request JSONWebToken Class
   */

  private createCredResp = async (
    credResp: CredentialShareResponseCreationArgs,
    pass: string,
    receivedJWT: JSONWebToken<JWTEncodable>,
  ) => {
    const credentialResponse = CredentialResponse.fromJSON(credResp)
    const jwt = JSONWebToken.fromJWTEncodable(credentialResponse)
    jwt.interactionType = InteractionType.CredentialResponse
    return this.initializeAndSign(
      jwt,
      this.publicKeyMetadata.derivationPath,
      pass,
      receivedJWT,
    )
  }

  /**
   * Creates and signs a credential receive (issue of a signed credential)
   * @param credReceive - Credential receive creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - received credential offer response JSONWebToken Class
   */

  private createCredReceive = async (
    credReceive: CredentialOfferResponseCreationArgs,
    pass: string,
    receivedJWT: JSONWebToken<JWTEncodable>,
  ) => {
    const credentialReceieve = CredentialsReceive.fromJSON(credReceive)
    const jwt = JSONWebToken.fromJWTEncodable(credentialReceieve)
    jwt.interactionType = InteractionType.CredentialsReceive
    return this.initializeAndSign(
      jwt,
      this.publicKeyMetadata.derivationPath,
      pass,
      receivedJWT,
    )
  }

  /**
   * Derives all public keys listed in the {@link KeyTypes} enum
   * @param encryptionPass - password for interfacing with the vaulted key provider
   * @example `iw.getPublicKeys('secret')` // { jolocomIdentityKey: '0xabc...ff', ethereumKey: '0xabc...ff'}
   */

  public getPublicKeys = (encryptionPass: string): PublicKeyMap => {
    const supportedKeys = Object.entries(KeyTypes)

    return supportedKeys.reduce<PublicKeyMap>((acc, currentEntry) => {
      const [keyType, derivationPath] = currentEntry

      return {
        ...acc,
        [keyType]: this.vaultedKeyProvider
          .getPublicKey({
            derivationPath,
            encryptionPass,
          })
          .toString('hex'),
      }
    }, {})
  }

  /**
   * Creates and signs a payment request for Ethereum
   * @param paymentReq - payment request creation args, if no receiving address is
   * specified, will default to the wallet's ethereum key
   * @param pass - Password to decrypt the vaulted seed
   */

  private createPaymentReq = async (
    paymentReq: PaymentRequestCreationArgs,
    pass: string,
  ) => {
    const { transactionOptions } = paymentReq

    // Assigning default values
    const paymentRequest = PaymentRequest.fromJSON({
      ...paymentReq,
      transactionOptions: {
        gasLimit: 21000,
        gasPrice: 10e9,
        to: transactionOptions.to
          ? transactionOptions.to
          : publicKeyToAddress(
              Buffer.from(this.getPublicKeys(pass).ethereumKey, 'hex'),
            ),
        ...transactionOptions,
      },
    })

    const jwt = JSONWebToken.fromJWTEncodable(paymentRequest)
    jwt.interactionType = InteractionType.PaymentRequest
    return this.initializeAndSign(
      jwt,
      this.publicKeyMetadata.derivationPath,
      pass,
    )
  }

  /**
   * Creates and signs a payment response which contains the transaction hash
   * @param paymentResp - payment response creation args
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - received payment request JSONWebToken Class
   */

  private createPaymentResp = async (
    paymentResp: PaymentResponseCreationArgs,
    pass: string,
    receivedJWT: JSONWebToken<JWTEncodable>,
  ) => {
    const paymentResponse = PaymentResponse.fromJSON(
      paymentResp,
    ) as PaymentResponse
    const jwt = JSONWebToken.fromJWTEncodable(paymentResponse)
    jwt.interactionType = InteractionType.PaymentResponse
    return this.initializeAndSign(
      jwt,
      this.publicKeyMetadata.derivationPath,
      pass,
      receivedJWT,
    )
  }

  /**
   * Validates interaction tokens for signature - if only received token passed - and for audience (aud) and token nonce (jti) if send token passed also
   * @param receivedJWT - received JSONWebToken Class
   * @param sendJWT - optional send JSONWebToken Class which is used to validate the token nonce and the aud field on received token
   * @param customRegistry - optional custom registry
   */

  public async validateJWT<T extends JWTEncodable, A extends JWTEncodable>(
    receivedJWT: JSONWebToken<T>,
    sendJWT?: JSONWebToken<A>,
    customRegistry?: IRegistry,
  ): Promise<void> {
    const registry = customRegistry || createJolocomRegistry()
    const remoteIdentity = await registry.resolve(
      keyIdToDid(receivedJWT.issuer),
    )
    const pubKey = getIssuerPublicKey(
      receivedJWT.issuer,
      remoteIdentity.didDocument,
    )

    handleValidationStatus(
      await SoftwareKeyProvider.verifyDigestable(pubKey, receivedJWT),
      'sig',
    )
    sendJWT &&
      handleValidationStatus(receivedJWT.audience === this.identity.did, 'aud')
    sendJWT &&
      handleValidationStatus(sendJWT.nonce === receivedJWT.nonce, 'nonce')
  }

  private sendTransaction = async (
    request: ITransactionEncodable,
    pass: string,
  ) => {
    const publicKey = this._vaultedKeyProvider.getPublicKey({
      derivationPath: KeyTypes.ethereumKey,
      encryptionPass: pass,
    })

    const address = publicKeyToAddress(publicKey)
    const { nonce } = await this._contractsGateway.getAddressInfo(address)

    const tx = this._contractsAdapter.assembleTxFromInteractionToken(
      request,
      address,
      nonce,
      this.vaultedKeyProvider,
      pass,
    )
    return this._contractsGateway.broadcastTransaction(tx)
  }

  /**
   * Initializes the JWT Class with required fields (exp, iat, iss, typ) and adds a signature
   * @param jwt - JSONWebToken Class
   * @param derivationPath - Derivation Path for identity keys
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - optional received JSONWebToken Class
   */

  private async initializeAndSign<T extends JWTEncodable>(
    jwt: JSONWebToken<T>,
    derivationPath: string,
    pass: string,
    receivedJWT?: JSONWebToken<T>,
  ) {
    jwt.setIssueAndExpiryTime()
    jwt.issuer = this.publicKeyMetadata.keyId

    receivedJWT ? (jwt.audience = keyIdToDid(receivedJWT.issuer)) : null
    receivedJWT
      ? (jwt.nonce = receivedJWT.nonce)
      : (jwt.nonce = generateRandomID(8))

    const signature = await this.vaultedKeyProvider.signDigestable(
      { derivationPath, encryptionPass: pass },
      jwt,
    )
    jwt.signature = signature.toString('hex')

    return jwt
  }

  public transactions = {
    sendTransaction: this.sendTransaction,
  }

  /* Gathering creation methods in an easier to use public interface */

  public create = {
    credential: Credential.create,
    signedCredential: this.createSignedCred,
    interactionTokens: {
      request: {
        auth: this.createAuth,
        offer: this.createCredOffer,
        share: this.createCredReq,
        payment: this.createPaymentReq,
      },
      response: {
        auth: this.createAuth,
        offer: this.createCredOffer,
        share: this.createCredResp,
        issue: this.createCredReceive,
        payment: this.createPaymentResp,
      },
    },
  }
}
