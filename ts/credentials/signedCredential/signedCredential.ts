import 'reflect-metadata'
import {
  plainToClass,
  classToPlain,
  Type,
  Expose,
  Exclude,
  Transform,
} from 'class-transformer'
import { canonize } from 'jsonld'
import { generateRandomID, sha256 } from '../../utils/crypto'
import { ISignedCredentialAttrs, ISignedCredCreationArgs } from './types'
import {
  ILinkedDataSignature,
  IDigestable,
} from '../../linkedDataSignature/types'
import { ContextEntry, BaseMetadata } from 'cred-types-jolocom-core'
import { IClaimSection } from '../credential/types'
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature'
import { ISigner } from '../../registries/types'
import { Credential } from '../credential/credential'
import { SoftwareKeyProvider } from '../../vaultedKeyProvider/softwareProvider'

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

@Exclude()
export class SignedCredential implements IDigestable {
  private '_@context': ContextEntry[]
  private _id: string = generateClaimId(8)
  private _name: string
  private _issuer: string
  private _type: string[]
  private _claim: IClaimSection = {}
  private _issued: Date
  private _expires?: Date
  private _proof: ILinkedDataSignature = new EcdsaLinkedDataSignature()

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

  set context(context: ContextEntry[]) {
    this['_@context'] = context
  }

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

  @Expose()
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

  @Expose()
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
   * Instantiates a {@link SignedCredential} based on passed options
   * @param credentialOptions - Options for creating credential, and for deriving public signing key
   * @param issInfo - Public data data
   * @example [[include:signedCredential.create.md]]
   * @internal
   */

  public static async create<T extends BaseMetadata>(
    credentialOptions: ISignedCredCreationArgs<T>,
    issInfo: IIssInfo,
  ) {
    const credential = Credential.create(credentialOptions)
    const json = credential.toJSON() as ISignedCredentialAttrs
    const signedCredential = SignedCredential.fromJSON(json)
    signedCredential.claim

    signedCredential.prepareSignature(issInfo.keyId)
    signedCredential.issuer = issInfo.issuerDid

    return signedCredential
  }

  /**
   * Sets all fields on the instance necessary to compute the signature
   * @param keyId - Public key identifier, as defined in the {@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}.
   * @internal
   */

  private prepareSignature(keyId: string) {
    const inOneYear = new Date()
    inOneYear.setFullYear(new Date().getFullYear() + 1)

    this.issued = new Date()
    this.expires = inOneYear

    this.proof.creator = keyId
    this.proof.signature = ''
    this.proof.nonce = SoftwareKeyProvider.getRandom(8).toString('hex')
  }

  /**
   * Returns the sha256 hash of the signed credential, per {@link https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm | specification}.
   * @internal
   */

  public async digest(): Promise<Buffer> {
    const normalized = await this.normalize()

    const docSectionDigest = sha256(Buffer.from(normalized))
    const proofSectionDigest = await this.proof.digest()

    return sha256(Buffer.concat([proofSectionDigest, docSectionDigest]))
  }

  /**
   * Converts the verifiable credential to canonical form
   * @see {@link https://w3c-dvcg.github.io/ld-signatures/#dfn-canonicalization-algorithm | Canonicalization algorithm }
   * @internal
   */

  private async normalize(): Promise<string> {
    const json = this.toJSON()
    delete json.proof

    return canonize(json)
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

/**
 * @ignore
 * Helper function generating a random claim id
 * @param length - The length of the random part of the identifier
 */

const generateClaimId = (length: number): string => {
  return `claimId:${generateRandomID(length)}`
}
