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
} from './types'
import {
  IDigestable,
  getLDSignatureTypeByKeyType,
} from '../../linkedDataSignature/types'
import { BaseMetadata } from '@jolocom/protocol-ts'
import { IClaimSection } from '../credential/types'
import { LinkedDataSignature } from '../../linkedDataSignature/index'
import { JsonLdContext } from '../../linkedData/types'
import { Credential } from '../credential/credential'
import { ErrorCodes } from '../../errors'
import { getRandomBytes } from '../../utils/crypto'
import { randomBytes } from 'crypto'
import { IdentityWallet } from '../../identityWallet/identityWallet'
import {
  withDefaultValue,
  dateToISOString,
  isoStringToDate,
} from '../../utils/classTransformerUtils'

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
 * @class
 * Class representing an JSON-LD verifiable credential.
 * @see {@link https://w3c.github.io/vc-data-model/ | verifiable credential specification}
 */

@Exclude()
export class SignedCredential implements IDigestable {
  private '_@context': JsonLdContext
  private _id: string = generateClaimId(8)
  private _name: string
  private _issuer: string
  private _type: string[]
  private _claim: IClaimSection = {}
  private _issued: Date
  private _expires?: Date
  private _proof: LinkedDataSignature = new LinkedDataSignature()

  /**
   * Get the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `console.log(signedCredential.context) // [{name: 'http://schema.org/name', ...}, {...}]`
   */

  @Expose({ name: '@context' })
  get context() {
    return this['_@context']
  }

  /**
   * Set the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `signedCredential.context = [{name: 'http://schema.org/name', ...}, {...}]`
   */

  set context(context: JsonLdContext) {
    this['_@context'] = context
  }

  /**
   * Get the identifier of the signed credential
   * @example `console.log(signedCredential.id) //claimId:25453fa543da7`
   */

  @Expose()
  @Transform(val => val || generateClaimId(8), { toClassOnly: true })
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
  @Transform(withDefaultValue(''))
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

  @Expose()
  @Transform(dateToISOString, { toPlainOnly: true })
  @Transform(isoStringToDate, { toClassOnly: true })
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

  @Expose()
  @Transform(dateToISOString, { toPlainOnly: true })
  @Transform(isoStringToDate, { toClassOnly: true })
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
  @Type(() => LinkedDataSignature)
  @Transform(withDefaultValue(new LinkedDataSignature()), { toClassOnly: true })
  get proof(): LinkedDataSignature {
    return this._proof
  }

  /**
   * Set the {@link EcdsaLinkedDataSignature} member of the instance
   * @example `signedCredential.proof = new EcdsaLinkedDataSignature()`
   */

  set proof(proof: LinkedDataSignature) {
    this._proof = proof
  }

  /**
   * Get the subject of the credential
   * @example `console.log(signedCredential.subject) // 'did:jolo:...'`
   */

  get subject(): string {
    return this.claim.id
  }

  /**
   * Set the subject of the credential
   * @example `signedCredential.subject = 'did:jolo:...'`
   */

  set subject(subject: string) {
    this.claim.id = subject
  }

  /**
   * Get the `claim` section of the credential
   * @example `console.log(signedCredential.claim) // { id: 'did:jolo:abcde', name: 'Example' }`
   */

  @Expose()
  get claim(): IClaimSection {
    return this._claim
  }

  /**
   * Set the `claim` section of the credential
   * @example `signedCredential.claim = { id: 'did:jolo:abcde', name: 'Example' }`
   */

  set claim(claim: IClaimSection) {
    this._claim = claim
  }

  /**
   * Get the presentable credential name if present
   * @default 'Credential'
   * @example `console.log(signedCredential.name) // 'Email'`
   */

  @Expose()
  get name(): string {
    if (this._name) {
      return this._name
    }

    /* Find first detailed cred type, e.g. ProofOfEmailCredential */
    const customType = this.type.find(t => t !== 'Credential')

    if (customType) {
      /* Split pascal cased title along uppercase letters */
      return customType.replace(/([A-Z])/g, ' $1').trim()
    }

    return 'Credential'
  }

  /**
   * Set the presentable credential name if present
   * @example `signedCredential.name = 'Email'`
   */

  set name(name: string) {
    this._name = name
  }

  /**
   * Instantiates a {@link SignedCredential} based on passed options. The proof section
   * of the credential is not populated until SignedCredential.sign() is called
   * @param credentialOptions - Options for creating credential
   * @param expires - Expiration date for the credential, defaults to 1 year from Date.now()
   * @example [[include:signedCredential.create.md]]
   * @internal
   */

  public static async create<T extends BaseMetadata>(
    credentialOptions: ISignedCredCreationArgs<T>,
    expires = new Date(Date.now() + DEFAULT_EXPIRY_MS),
  ) {
    const credential = Credential.create(credentialOptions)
    const json = (credential.toJSON() as unknown) as ISignedCredentialAttrs
    const signedCredential = SignedCredential.fromJSON(json)

    signedCredential.expires = expires
    signedCredential.issued = new Date()

    if (signedCredential.expires <= signedCredential.issued) {
      throw new Error(ErrorCodes.VCInvalidExpiryDate)
    }

    return signedCredential
  }

  public async sign(identityWallet: IdentityWallet, password: string) {
    const { keyId, type } = identityWallet.publicKeyMetadata.signingKey

    const signatureSuite = getLDSignatureTypeByKeyType(type)

    if (!signatureSuite) {
      throw new Error(`No LD signature suite found for key of type ${type}`)
    }

    this.issuer = identityWallet.did
    this.proof.created = new Date()
    this.proof.creator = keyId
    this.proof.type = getLDSignatureTypeByKeyType(type)
    this.proof.nonce = (await getRandomBytes(8)).toString('hex')
    this.proof.signature = await identityWallet
      .sign(await this.asBytes(), password)
      .then(res => res.toString('base64'))
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
