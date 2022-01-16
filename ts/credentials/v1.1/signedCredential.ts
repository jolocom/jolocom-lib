import 'reflect-metadata'
import {
  classToPlain,
  Exclude,
  Expose,
  plainToClass,
  Transform,
  Type,
} from 'class-transformer'
import { digestJsonLd, normalizeSignedLdObject } from '../../linkedData'
import {
  ISignedCredCreationArgs,
  ISignedCredentialAttrs,
  ISigner,
} from '../types'
import {
  IDigestable,
  ILinkedDataSignature,
} from '../../linkedDataSignature/types'
import { BaseMetadata } from '@jolocom/protocol-ts'
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature'
import { Credential } from './credential'
import { ErrorCodes } from '../../errors'
import { getRandomBytes } from '../../utils/crypto'
import { randomBytes } from 'crypto'

// Credentials are valid for a year by default
const DEFAULT_EXPIRY_MS = 365 * 24 * 3600 * 1000

/**
 * @ignore
 * Helper function generating a random claim id
 * @param length - The length of the random part of the identifier
 */

const generateClaimId = (length: number) =>
  `claimId:${randomBytes(length).toString('hex')}`

/**
 * @description Data needed to prepare signature on credential
 * @see {@link https://w3c.github.io/vc-data-model/ | specification}
 */

interface IIssInfo {
  keyId: string
  issuerDid: string
}

/**
 * @class
 * Class representing an JSON-LD verifiable credential.
 * @see {@link https://w3c.github.io/vc-data-model/ | verifiable credential specification}
 */

// TODO CHANGE PROOFS TO ARRAY
@Exclude()
export class SignedCredential extends Credential implements IDigestable {
  private _issuer: string
  private _issued: Date
  private _expires?: Date
  private _proof: ILinkedDataSignature = new EcdsaLinkedDataSignature()

  /**
   * Get the identifier of the signed credential
   * @example `console.log(signedCredential.id) //claimId:25453fa543da7`
   */

  @Expose()
  @Transform(value => value || generateClaimId(8), { toClassOnly: true })
  get id(): string {
    return this._id
  }

  /**
   * Set the identifier of the signed credential
   * @example `signedCredential.id = 'claimId:2543fa543da7'`
   */

  set id(id: string) {
    this._id = id
  }

  /**
   * Get the issuer of the signed credential
   * @example `console.log(signedCredential.issuer) // 'did:jolo:abc...'`
   */

  @Expose()
  get issuer(): string {
    return this._issuer
  }

  /**
   * Set the issuer of the signed credential
   * @example `signedCredential.issuer = 'did:jolo:abc...'`
   */

  set issuer(issuer: string) {
    this._issuer = issuer
  }

  /**
   * Get the issuance date of the signed credential
   * @example `console.log(signedCredential.issued) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose({name: "issuanceDate"})
  @Transform((value: Date) => value && value.toISOString(), {
    toPlainOnly: true,
  })
  @Transform((value: string) => value && new Date(value), { toClassOnly: true })
  get issued(): Date {
    return this._issued
  }

  /**
   * Set the issuance date of the signed credential
   * @example `signedCredential.issued = new Date('2018-11-11T15:46:09.720Z')`
   */

  set issued(issued: Date) {
    this._issued = issued
  }

  /**
   * Get the type of the signed credential
   * @example `console.log(signedCredential.type) // ['Credential', 'ProofOf...Credential']`
   */

  @Expose()
  get type(): string[] {
    return this._type
  }

  /**
   * Set the type of the credential
   * @example `signedCredential.type = ['Credential', 'ProofOf...Credential']`
   */

  set type(type: string[]) {
    this._type = type
  }

  /**
   * Get the hex encoded credential signature
   * @example `console.log(signedCredential.signature) // '2b8504698e...'`
   */

  get signature() {
    return this._proof.signature
  }

  /**
   * Set the hex encoded credential signature
   * @example `signedCredential.signature = '2b8504698e...'`
   */

  set signature(signature: string) {
    this._proof.signature = signature
  }

  /**
   * Get aggregated metadata related to the signing public key
   * @see{@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}
   * @example `console.log(signedCredential.signer) // { did: 'did:jolo:...', keyId: 'did:jolo:...#keys-1' }`
   */

  get signer(): ISigner {
    return {
      did: this.issuer,
      keyId: this._proof.creator,
    }
  }

  /**
   * Get the expiry date of the signed credential
   * @example `console.log(signedCredential.expires) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose({name: "expirationDate"})
  @Transform((value: Date) => value && value.toISOString(), {
    toPlainOnly: true,
  })
  @Transform((value: string) => value && new Date(value), { toClassOnly: true })
  get expires(): Date {
    return this._expires
  }

  /**
   * Set the expiry date of the signed credential
   * @example `signedCredential.expires = new Date('2019-11-11T15:46:09.720Z')`
   */

  set expires(expiry: Date) {
    this._expires = expiry
  }

  /**
   * Get the {@link EcdsaLinkedDataSignature} member of the instance
   * @example `console.log(signedCredential.proof) // EcdsaLinkedDataSignature { ... }`
   */

  @Expose()
  @Type(() => EcdsaLinkedDataSignature)
  @Transform(value => value || new EcdsaLinkedDataSignature(), {
    toClassOnly: true,
  })
  get proof(): ILinkedDataSignature {
    return this._proof
  }

  /**
   * Set the {@link EcdsaLinkedDataSignature} member of the instance
   * @example `signedCredential.proof = new EcdsaLinkedDataSignature()`
   */

  set proof(proof: ILinkedDataSignature) {
    this._proof = proof
  }

  /**
   * Get the subject of the credential
   * @example `console.log(signedCredential.subject) // 'did:jolo:...'`
   */

  get subject(): string {
    return this.credentialSubject.id
  }

  /**
   * Set the subject of the credential
   * @example `signedCredential.subject = 'did:jolo:...'`
   */

  set subject(subject: string) {
    this.credentialSubject.id = subject
  }

  /**
   * Get the presentable credential name if present
   * @default 'Credential'
   * @example `console.log(signedCredential.name) // 'Email'`
   */

  /**
   * Instantiates a {@link SignedCredential} based on passed options
   * @param credentialOptions - Options for creating credential, and for deriving public signing key
   * @param issInfo - Public data data
   * @param expires - Expiration date for the credential, defaults to 1 year from Date.now()
   * @example [[include:signedCredential.create.md]]
   * @internal
   */

  public static async create<T extends BaseMetadata>(
    credentialOptions: ISignedCredCreationArgs<T>,
    issInfo: IIssInfo,
    expires = new Date(Date.now() + DEFAULT_EXPIRY_MS),
  ) {
    const credential = Credential.build(credentialOptions)
    const json = (credential.toJSON() as unknown) as ISignedCredentialAttrs
    const signedCredential = SignedCredential.fromJSON(json)

    signedCredential.expires = expires
    signedCredential.issued = new Date()

    if (signedCredential.expires <= signedCredential.issued) {
      throw new Error(ErrorCodes.VCInvalidExpiryDate)
    }

    await signedCredential.prepareSignature(issInfo.keyId)
    signedCredential.issuer = issInfo.issuerDid

    return signedCredential
  }

  /**
   * Sets all fields on the instance necessary to compute the signature
   * @param keyId - Public key identifier, as defined in the {@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}.
   * @internal
   */

  private async prepareSignature(keyId: string) {
    this.proof.creator = keyId
    // TODO Is this needed?
    this.proof.signature = ''
    this.proof.nonce = (await getRandomBytes(8)).toString('hex')
  }

  public async asBytes(): Promise<Buffer> {
    return normalizeSignedLdObject(this.toJSON(), this.context)
  }

  /**
   * Returns the sha256 hash of the signed credential, per {@link https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm | specification}.
   * @internal
   */

  public async digest(): Promise<Buffer> {
    return digestJsonLd(this.toJSON(), this.context)
  }

  /**
   * Instantiates a {@link SignedCredential} from it's JSON form
   * @param json - Verifiable Credential in JSON-LD form
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  public static fromJSON(json: ISignedCredentialAttrs): SignedCredential {
    return plainToClass(SignedCredential, json)
  }

  /**
   * Serializes the {@link SignedCredential} as JSON-LD
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  public toJSON(): ISignedCredentialAttrs {
    return classToPlain(this) as ISignedCredentialAttrs
  }
}
