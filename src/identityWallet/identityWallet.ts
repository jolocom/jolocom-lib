import { BaseMetadata } from '@jolocom/protocol-ts'
import { Credential } from '../credentials/credential/credential'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import {
  ExclusivePartial,
  IKeyMetadata,
  IIdentityWalletCreateArgs,
} from './types'
import { Identity } from '../identity/identity'
import { JSONWebToken, JWTEncodable } from '../interactionTokens/JSONWebToken'
import { InteractionType, KeyTypeToJWA } from '../interactionTokens/types'
import { Authentication } from '../interactionTokens/authentication'
import { CredentialRequest } from '../interactionTokens/credentialRequest'
import { CredentialResponse } from '../interactionTokens/credentialResponse'
import { ISignedCredCreationArgs } from '../credentials/signedCredential/types'
import { keyIdToDid } from '../utils/helper'
import { CredentialOfferRequest } from '../interactionTokens/credentialOfferRequest'
import { CredentialOfferResponse } from '../interactionTokens/credentialOfferResponse'
import { CredentialsReceive } from '../interactionTokens/credentialsReceive'
import {
  CredentialOfferRequestAttrs,
  CredentialOfferResponseAttrs,
  IAuthenticationAttrs,
  ICredentialRequestAttrs,
  ICredentialResponseAttrs,
  ICredentialsReceiveAttrs,
} from '../interactionTokens/interactionTokens.types'
import { ErrorCodes } from '../errors'
import { JoloDidMethod } from '../didMethods/jolo'
import {
  IVaultedKeyProvider,
  IKeyRefArgs,
  KeyTypes,
} from '@jolocom/vaulted-key-provider'
import { getCryptoProvider } from '@jolocom/vaulted-key-provider/js/cryptoProvider'
import { getRandomBytes } from '../utils/crypto'
import { cryptoUtils } from '@jolocom/native-core'
import { validateDigestable } from '../utils/validation'
import { IResolver } from '../didMethods/types'
import { base64url } from 'rfc4648'

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

/*
 * TODO Easiest way to add a new argument to all function signatures.
 *  once the different creation functions have been simplified, this can be
 *  refactored away
 */

type WithExtraOptions<T> = T & {
  expires?: Date
  aud?: string
  pca?: string
}

/**
 * @class
 * Developer facing class with initialized instance of the key provider as member.
 * Encapsulates functionality related to creating and signing credentials and
 * interaction tokens
 */

export class IdentityWallet {
  private _identity!: Identity
  private _publicKeyMetadata!: IKeyMetadata
  private _keyProvider: IVaultedKeyProvider

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
  }: IIdentityWalletCreateArgs) {
    if (!identity || !publicKeyMetadata || !vaultedKeyProvider) {
      throw new Error(ErrorCodes.IDWInvalidCreationArgs)
    }

    this.identity = identity
    this.publicKeyMetadata = publicKeyMetadata
    this._keyProvider = vaultedKeyProvider
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
    const vCred = await SignedCredential.create(
      {
        ...credentialParams,
        subject: credentialParams.subject || this.did,
      },
      {
        keyId: this.publicKeyMetadata.signingKeyId,
        issuerDid: this.did,
      },
      expires,
    )

    const signature = await this._keyProvider.sign(
      {
        encryptionPass: pass,
        keyRef: this._publicKeyMetadata.signingKeyId, // TODO Is this reliable? Or rather, where is this set?
      },
      await vCred.asBytes(),
    )

    vCred.signature = signature.toString('hex')
    return vCred
  }

  /**
   * Creates and signs a message
   * @param args - Message creation attributes
   * @param pass - Password to decrypt the vaulted seed
   * @param received - optional received JSONWebToken Class
   */
  private createMessage = async <T, R>(
    args: { message: T; typ: string; expires?: Date; aud?: string, pca?: string },
    pass: string,
    recieved?: JSONWebToken<R>,
  ) => {
    const jwt = JSONWebToken.fromJWTEncodable(args.message)
    jwt.interactionType = args.typ
    if (args.aud) jwt.audience = args.aud
    if (args.pca) jwt.payload.pca = args.pca
    jwt.timestampAndSetExpiry(args.expires)

    return this.initializeAndSign(jwt, pass, recieved)
  }

  private makeReq = <T, Ret=JWTEncodable>(typ: string) => (
    { expires, aud, pca, ...message }: WithExtraOptions<T>,
    pass: string,
  ) =>
    this.createMessage(
      {
        // @ts-ignore
        message: this.messageCannonicaliser(typ).fromJSON(message),
        typ,
        expires,
        aud,
        pca
      },
      pass,
    ) as unknown as Promise<JSONWebToken<Ret>>

  private makeRes = <T, R, Ret=JWTEncodable>(typ: string) => (
    { expires, aud, pca, ...message }: WithExtraOptions<T>,
    pass: string,
    recieved?: JSONWebToken<R>,
  ) =>
    this.createMessage(
      {
        // @ts-ignore
        message: this.messageCannonicaliser(typ).fromJSON(message),
        typ,
        expires,
        aud,
        pca
      },
      pass,
      recieved,
    ) as unknown as Promise<JSONWebToken<Ret>>

  private messageCannonicaliser = (typ: string) => {
    switch (typ) {
      case InteractionType.CredentialsReceive:
        return CredentialsReceive
      case InteractionType.CredentialOfferRequest:
        return CredentialOfferRequest
      case InteractionType.CredentialOfferResponse:
        return CredentialOfferResponse
      case InteractionType.CredentialRequest:
        return CredentialRequest
      case InteractionType.CredentialResponse:
        return CredentialResponse
      case InteractionType.Authentication:
        return Authentication
    }
    throw new Error(ErrorCodes.JWTInvalidInteractionType)
  }

  /**
   * Derives all public keys listed in the {@link KeyTypes} enum
   * @param encryptionPass - password for interfacing with the vaulted key provider
   * @example `iw.getPublicKeys('secret')` // { jolocomIdentityKey: '0xabc...ff', ethereumKey: '0xabc...ff'}
   */

  // TODO Don't just delegate to the vkp, postprocess to make easier to consume
  public getPublicKeys = (encryptionPass: string) =>
    this._keyProvider.getPubKeys(encryptionPass)

  /**
   * Initializes the JWT Class with required fields (exp, iat, iss, typ) and adds a signature
   * @param jwt - JSONWebToken Class
   * @param pass - Password to decrypt the vaulted seed
   * @param receivedJWT - optional received JSONWebToken Class
   */

  private async initializeAndSign<T, R>(
    jwt: JSONWebToken<T>,
    pass: string,
    receivedJWT?: JSONWebToken<R>,
  ) {
    if (receivedJWT) {
      jwt.audience = receivedJWT.signer.did
      jwt.nonce = receivedJWT.nonce
    } else {
      jwt.nonce = (await getRandomBytes(8)).toString('hex')
    }

    const { signingKeyId } = this.publicKeyMetadata
    const { type: signingKeyType } = await this._keyProvider.getPubKeyByController(
      pass, signingKeyId
    )
    jwt.issuer = signingKeyId
    jwt.header = {
      typ: "JWT",
      alg: KeyTypeToJWA[signingKeyType]
    }

    const signature = await this._keyProvider.sign(
      {
        // TODO
        encryptionPass: pass,
        keyRef: signingKeyId,
      },
      await jwt.asBytes(),
    ) // TODO Also, are the signatures hex or b64?

    jwt.signature = base64url.stringify(signature, { pad: false })

    return jwt
  }

  /**
   * Validates interaction tokens for signatures, expiry, jti, and audience
   * @param receivedJWT - received JSONWebToken Class
   * @param sendJWT - optional send JSONWebToken Class which is used to validate the token nonce and the aud field on received token
   * @param resolver - instance of a {@link Resolver} to use for retrieving the signer's keys. If none is provided, the
   * default Jolocom contract is used for resolution.
   */

  // TODO Should this just take a resolve function? Probably yes
  public async validateJWT<T, R>(
    receivedJWT: JSONWebToken<T>,
    sentJWT?: JSONWebToken<R>,
    resolver: IResolver = new JoloDidMethod().resolver,
  ): Promise<void> {
    if (!(await validateDigestable(receivedJWT, resolver))) {
      throw new Error(ErrorCodes.IDWInvalidJWTSignature)
    }

    // TODO Should this somehow take into consideration the issuance date of the request
    // if one is present?
    if (receivedJWT.expires < Date.now()) {
      throw new Error(ErrorCodes.IDWTokenExpired)
    }

    // In case the request object is provided (we are validating a response)
    if (sentJWT) {
      // We make sure the aud on the received message matches the issuer of the request
      if (receivedJWT.audience !== sentJWT.signer.did) {
        throw new Error(ErrorCodes.IDWNotCorrectResponder)
      }

      // We make sure the request and response share the same random nonce, i.e. part of one interaction
      if (sentJWT.nonce !== receivedJWT.nonce) {
        throw new Error(ErrorCodes.IDWIncorrectJWTNonce)
      }
    } else {
      // No request object is provided (we are either validating a request, or a response in isolation)
      // In which case, we make sure that if the request had a target audience, it matches our identity
      if (receivedJWT.audience && receivedJWT.audience !== this.identity.did) {
        throw new Error(ErrorCodes.IDWNotIntendedAudience)
      }
    }
  }

  /**
   * Encrypts data asymmetrically, give a key
   *
   * @param data Buffer   The data to encrypt
   * @param key  Buffer   The key to encrypt to
   * @param type KeyTypes The type of the key to encrypt to
   */
  public asymEncrypt = async (data: Buffer, key: Buffer, type: KeyTypes) =>
    getCryptoProvider(cryptoUtils).encrypt(key, type, data)

  /**
   * Encrypts data asymmetrically, given a key reference (including the DID)
   * It resolves the DID and looks for the referenced key
   *
   * @param data     Buffer    The data to encrypt
   * @param keyRef   string    The public key reference to encrypt to (e.g. 'did:jolo:12345#key-1')
   * @param resolver IResolver instance of a {@link Resolver} to use for
   *                           retrieving the target's public keys. If none is provided, the default
   *                           Jolocom contract is used for resolution.
   */
  public asymEncryptToDidKey = async (
    data: Buffer,
    keyRef: string,
    resolver: IResolver = new JoloDidMethod().resolver,
  ) =>
    resolver.resolve(keyIdToDid(keyRef)).then(ident => {
      const pk = ident.publicKeySection.find(pk => keyRef.endsWith(pk.id))
      if (!pk) throw new Error(ErrorCodes.PublicKeyNotFound)

      return this.asymEncrypt(
        data,
        Buffer.from(pk.publicKeyHex, 'hex'),
        pk.type as KeyTypes,
      )
    })

  /**
   * Encrypts data asymmetrically, given a DID
   * It resolves the DID and looks for the first key of type x25519KeyAgreementKey2019
   *
   * @param data     Buffer    The data to encrypt
   * @param did     string     The DID whose public key will be used to encrypt to (e.g. 'did:jolo:12345#key-1')
   * @param resolver IResolver instance of a {@link Resolver} to use for
   *                           retrieving the target's public keys. If none is provided, the default
   *                           Jolocom contract is used for resolution.
   */
  public asymEncryptToDid = async (
    data: Buffer,
    did: string,
    resolver: IResolver = new JoloDidMethod().resolver,
  ) =>
    resolver.resolve(did).then(ident => {
      const encKey = ident.didDocument.publicKey.find(
        k => k.type === KeyTypes.x25519KeyAgreementKey2019,
      )
      if (!encKey) throw new Error(ErrorCodes.PublicKeyNotFound)
      return this.asymEncrypt(
        data,
        Buffer.from(encKey.publicKeyHex, 'hex'),
        encKey.type as KeyTypes,
      )
    })

  /**
   * Decrypts data asymmetrically
   *
   * @param data - The data to decrypt
   * @param pass - The VKP password
   */
  public asymDecrypt = async (data: Buffer, pass: string) =>
    this._keyProvider.decrypt(
      {
        encryptionPass: pass,
        keyRef: this._publicKeyMetadata.encryptionKeyId,
      },
      data,
    )

  /**
   * Signs data
   *
   * @param data - The data to sign
   * @param pass - The VKP password
   */
  public sign = async (data: Buffer, pass: string) =>
    this._keyProvider.sign(
      {
        encryptionPass: pass,
        keyRef: this._publicKeyMetadata.signingKeyId,
      },
      data,
    )

  /* Gathering creation methods in an easier to use public interface */
  public create = {
    credential: Credential.create,
    signedCredential: this.createSignedCred,
    message: this.createMessage,
    interactionTokens: {
      request: {
        auth: this.makeReq<
          ExclusivePartial<IAuthenticationAttrs, 'callbackURL'>,
          Authentication
        >(InteractionType.Authentication),
        offer: this.makeReq<
          CredentialOfferRequestAttrs,
          CredentialOfferRequest
        >(
          InteractionType.CredentialOfferRequest,
        ),
        share: this.makeReq<
          ICredentialRequestAttrs,
          CredentialRequest
        >(
          InteractionType.CredentialRequest,
        ),
      },
      response: {
        auth: this.makeRes<
          ExclusivePartial<IAuthenticationAttrs, 'callbackURL'>,
          Authentication,
          Authentication
        >(InteractionType.Authentication),
        offer: this.makeRes<
          CredentialOfferResponseAttrs,
          CredentialOfferRequest,
          CredentialOfferResponse
        >(InteractionType.CredentialOfferResponse),
        share: this.makeRes<
          ICredentialResponseAttrs,
          CredentialRequest,
          CredentialResponse
        >(
          InteractionType.CredentialResponse,
        ),
        issue: this.makeRes<
          ICredentialsReceiveAttrs,
          CredentialOfferResponse,
          CredentialsReceive
        >(
          InteractionType.CredentialsReceive,
        ),
      },
    },
  }
}
