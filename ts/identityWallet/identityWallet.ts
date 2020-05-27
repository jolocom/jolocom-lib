import { BaseMetadata } from 'cred-types-jolocom-core'
import { Credential } from '../credentials/credential/credential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { ExclusivePartial, IIdentityWalletCreateArgs } from './types'
import { Identity } from '../identity/identity'
import { JSONWebToken, JWTEncodable } from '../interactionTokens/JSONWebToken'
import { InteractionType } from '../interactionTokens/types'
import { PaymentResponse } from '../interactionTokens/paymentResponse'
import { PaymentRequest } from '../interactionTokens/paymentRequest'
import { Authentication } from '../interactionTokens/authentication'
import { CredentialRequest } from '../interactionTokens/credentialRequest'
import { CredentialResponse } from '../interactionTokens/credentialResponse'
import { SoftwareKeyProvider } from '../vaultedKeyProvider/softwareProvider'
import {
  IVaultedKeyProvider,
  KeyTypes,
  IKeyDerivationArgs,
} from '../vaultedKeyProvider/types'
import {
  IKeyMetadata,
  ISignedCredCreationArgs,
} from '../credentials/signedCredential/types'
import {
  keyIdToDid,
  getIssuerPublicKey,
  publicKeyToAddress,
} from '../utils/helper'
import { createJolocomRegistry } from '../registries/jolocomRegistry'
import { CredentialsReceive } from '../interactionTokens/credentialsReceive'
import {
  IContractsAdapter,
  IContractsGateway,
  ITransactionEncodable,
} from '../contracts/types'
import { IRegistry } from '../registries/types'
import { CredentialOfferRequest } from '../interactionTokens/credentialOfferRequest'
import { CredentialOfferResponse } from '../interactionTokens/credentialOfferResponse'
import {
  CredentialOfferRequestAttrs,
  CredentialOfferResponseAttrs,
  IAuthenticationAttrs,
  ICredentialRequestAttrs,
  ICredentialResponseAttrs,
  ICredentialsReceiveAttrs,
  IPaymentRequestAttrs,
  IPaymentResponseAttrs,
} from '../interactionTokens/interactionTokens.types'
import { ErrorCodes } from '../errors'

/**
 * @dev We use Class Transformer (CT) to instantiate all interaction Tokens i.e. in
 * identityWallet.create.interactionTokens.* calls.
 * Because of CT we can't define constructors on the interaction token classes.
 * The de facto constructor is the `fromJSON(json)` call. Therefore the arguments
 * to instantiate one are often times the same as for `fromJSON`.
 *  Some values are optional because the function instantiating the Interaction Token
 * can sometimes set sane defaults.
 * As a conclusion, A lot of the interfaces for creating a new interaction token using
 * the identity wallet match the JSON interface (with some keys potentially optional)
 */

interface PaymentRequestCreationArgs {
  callbackURL: string
  description: string
  transactionOptions: ExclusivePartial<
    IPaymentRequestAttrs['transactionOptions'],
    'value'
  >
}

// TODO Remove this perhaps, only used in one place
type PublicKeyMap = { [key in keyof typeof KeyTypes]?: string }

/*
 * TODO Easiest way to add a new argument to all function signatures.
 *  once the different creation functions have been simplified, this can be
 *  refactored away
 */

type WithExtraOptions<T> = T & {
  expires?: Date
}

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

  public get did(): string {
    return this.identity.did
  }

  /**
   * Set the did associated with the identity wallet
   * @example `identityWallet.did = 'did:jolo:...'`
   */

  public set did(did: string) {
    this.identity.did = did
  }

  /**
   * Get the {@link Identity} associated with the identity wallet
   * @example `console.log(identityWallet.identity) // Identity {...}`
   */

  public get identity() {
    return this._identity
  }

  /**
   * Get the {@link Identity} associated wtith the identity wallet
   * @example `identityWallet.identity = Identity.fromDidDocument(...)`
   */

  public set identity(identity: Identity) {
    this._identity = identity
  }

  /**
   * Get the {@link DidDocument} associated wtith the identity wallet
   * @example `console.log(identityWallet.didDocument) // DidDocument {...}`
   */

  public get didDocument() {
    return this.identity.didDocument
  }

  /**
   * Set the {@link DidDocument} associated wtith the identity wallet
   * @example `identityWallet.didDocument = DidDocument.fromPublicKey(...)`
   */

  public set didDocument(didDocument) {
    this.identity.didDocument = didDocument
  }

  /**
   * Get the metadata about the key pair associated wtith the identity wallet
   * @example `console.log(identityWallet.publicKeyMetadata) // {derivationPath: '...', keyId: '...'}`
   */

  public get publicKeyMetadata(): IKeyMetadata {
    return this._publicKeyMetadata
  }

  /**
   * Set the metadata about the key pair associated wtith the identity wallet
   * @example `identityWallet.publicKeyMetadata = {derivationPath: '...', keyId: '...'}`
   */

  public set publicKeyMetadata(metadata: IKeyMetadata) {
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

  public constructor({
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
      throw new Error(ErrorCodes.IDWInvalidCreationArgs)
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
    {
      expires,
      ...credentialParams
    }: WithExtraOptions<ISignedCredCreationArgs<T>>,
    pass: string,
  ) => {
    const { derivationPath } = this.publicKeyMetadata

    const vCred = await SignedCredential.create(
      {
        subject: credentialParams.subject || this.did,
        ...credentialParams,
      },
      {
        keyId: this.publicKeyMetadata.keyId,
        issuerDid: this.did,
      },
      expires,
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
   * @param authArgs - Authentication creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - optional received authentication JSONWebToken Class
   */

  private createAuth = async (
    authArgs: WithExtraOptions<
      ExclusivePartial<IAuthenticationAttrs, 'callbackURL'>
    >,
    pass: string,
    receivedJWT?: JSONWebToken<JWTEncodable>,
  ) => {
    const authenticationReq = Authentication.fromJSON({
      description: 'Authorize the transaction',
      ...authArgs,
    })

    const jwt = JSONWebToken.fromJWTEncodable(authenticationReq)
    jwt.interactionType = InteractionType.Authentication
    jwt.timestampAndSetExpiry(authArgs.expires)

    return this.initializeAndSign(
      jwt,
      this.publicKeyMetadata.derivationPath,
      pass,
      receivedJWT,
    )
  }

  /**
   * Creates and signs a credential offer request
   * @param credOffer - Credential offer creation attributes
   * @param pass - Password to decrypt the vaulted seed
   */

  private createCredOfferRequest = async (
    credOffer: WithExtraOptions<CredentialOfferRequestAttrs>,
    pass: string,
  ) => {
    const offer = CredentialOfferRequest.fromJSON(credOffer)
    const jwt = JSONWebToken.fromJWTEncodable(offer)
    jwt.interactionType = InteractionType.CredentialOfferRequest
    jwt.timestampAndSetExpiry(credOffer.expires)

    return this.initializeAndSign(
      jwt,
      this.publicKeyMetadata.derivationPath,
      pass,
    )
  }

  /**
   * Creates and signs a credential offer response
   * @param credentialOfferResponse - Credential offer response creation arguments
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - optional received credential offer JSONWebToken Class
   */

  private createCredentialOfferResponse = async (
    credentialOfferResponse: WithExtraOptions<CredentialOfferResponseAttrs>,
    pass: string,
    receivedJWT?: JSONWebToken<JWTEncodable>,
  ) => {
    const offerResponse = CredentialOfferResponse.fromJSON(
      credentialOfferResponse,
    )
    const jwt = JSONWebToken.fromJWTEncodable<CredentialOfferResponse>(
      offerResponse,
    )
    jwt.interactionType = InteractionType.CredentialOfferResponse
    jwt.timestampAndSetExpiry(credentialOfferResponse.expires)

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
    credReq: WithExtraOptions<ICredentialRequestAttrs>,
    pass: string,
  ) => {
    const credentialRequest = CredentialRequest.fromJSON(credReq)
    const jwt = JSONWebToken.fromJWTEncodable(credentialRequest)
    jwt.interactionType = InteractionType.CredentialRequest
    jwt.timestampAndSetExpiry(credReq.expires)
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
    credResp: WithExtraOptions<ICredentialResponseAttrs>,
    pass: string,
    receivedJWT: JSONWebToken<JWTEncodable>,
  ) => {
    const credentialResponse = CredentialResponse.fromJSON(credResp)
    const jwt = JSONWebToken.fromJWTEncodable(credentialResponse)
    jwt.interactionType = InteractionType.CredentialResponse
    jwt.timestampAndSetExpiry(credResp.expires)

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
    credReceive: WithExtraOptions<ICredentialsReceiveAttrs>,
    pass: string,
    receivedJWT: JSONWebToken<JWTEncodable>,
  ) => {
    const credentialReceieve = CredentialsReceive.fromJSON(credReceive)
    const jwt = JSONWebToken.fromJWTEncodable(credentialReceieve)
    jwt.interactionType = InteractionType.CredentialsReceive
    jwt.timestampAndSetExpiry(credReceive.expires)
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
    paymentReq: WithExtraOptions<PaymentRequestCreationArgs>,
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
    paymentResp: WithExtraOptions<IPaymentResponseAttrs>,
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
    if (receivedJWT) {
      jwt.audience = keyIdToDid(receivedJWT.issuer)
      jwt.nonce = receivedJWT.nonce
    } else {
      jwt.nonce = SoftwareKeyProvider.getRandom(8).toString('hex')
    }

    jwt.issuer = this.publicKeyMetadata.keyId

    const signature = await this.vaultedKeyProvider.signDigestable(
      { derivationPath, encryptionPass: pass },
      jwt,
    )
    jwt.signature = signature.toString('hex')

    return jwt
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

    if (!(await SoftwareKeyProvider.verifyDigestable(pubKey, receivedJWT))) {
      throw new Error(ErrorCodes.IDWInvalidJWTSignature)
    }

    if (sendJWT && receivedJWT.audience !== this.identity.did) {
      throw new Error(ErrorCodes.IDWNotIntendedAudience)
    }

    if (sendJWT && sendJWT.nonce !== receivedJWT.nonce) {
      throw new Error(ErrorCodes.IDWIncorrectJWTNonce)
    }

    if (receivedJWT.expires < Date.now()) {
      throw new Error(ErrorCodes.IDWTokenExpired)
    }
  }

  public asymEncrypt = async (data: Buffer, publicKey: Buffer) =>
    this.vaultedKeyProvider.asymEncrypt(data, publicKey)

  public asymEncryptToDidKey = async (
    data: Buffer,
    keyRef: string,
    customRegistry?: IRegistry,
  ) =>
    (customRegistry || createJolocomRegistry())
      .resolve(keyIdToDid(keyRef))
      .then(target =>
        this.asymEncrypt(data, getIssuerPublicKey(keyRef, target.didDocument)),
      )

  public asymDecrypt = async (
    data: string,
    decryptionKeyArgs: IKeyDerivationArgs,
  ) => this.vaultedKeyProvider.asymDecrypt(data, decryptionKeyArgs)

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
        offer: this.createCredOfferRequest,
        share: this.createCredReq,
        payment: this.createPaymentReq,
      },
      response: {
        auth: this.createAuth,
        offer: this.createCredentialOfferResponse,
        share: this.createCredResp,
        issue: this.createCredReceive,
        payment: this.createPaymentResp,
      },
    },
  }
}
