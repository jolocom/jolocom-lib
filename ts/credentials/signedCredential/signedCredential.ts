import 'reflect-metadata'
import { plainToClass, classToPlain, Type, Expose, Exclude, Transform } from 'class-transformer'
import { canonize } from 'jsonld'
import { generateRandomID, sha256 } from '../../utils/crypto'
import { ISignedCredentialAttrs, ISignedCredCreationArgs } from './types'
import { ILinkedDataSignature, IDigestable } from '../../linkedDataSignature/types'
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
   * @description - Returns the credential identifier
   * @returns {string} - The credential identifier
   * @see {@link https://w3c.github.io/vc-data-model/#identifiers | specification}
   */
  @Expose({ name: '@context' })
  get context() {
    return this['_@context']
  }

  set context(context: ContextEntry[]) {
    this['_@context'] = context
  }

  /**
   * @description - Returns the credential identifier
   * @returns {string} - The credential identifier
   * @see {@link https://w3c.github.io/vc-data-model/#identifiers | specification}
   */
  @Expose()
  @Transform(value => value || generateClaimId(8), { toClassOnly: true })
  get id(): string {
    return this._id
  }

  set id(id: string) {
    this._id = id
  }

  /**
   * @description - Returns the issuer of the signed credential
   * @returns {string} - The did of the issuer
   */
  @Expose()
  get issuer(): string {
    return this._issuer
  }

  set issuer(issuer: string) {
    this._issuer = issuer
  }

  /**
   * @description - Returns the credential issue date
   * @returns {Date} - Issue date
   */
  @Expose()
  @Transform((value: Date) => value && value.toISOString(), { toPlainOnly: true })
  @Transform((value: string) => value && new Date(value), { toClassOnly: true })
  get issued(): Date {
    return this._issued
  }

  set issued(issued: Date) {
    this._issued = issued
  }

  /**
   * @description - Returns the credential type
   * @returns {string[]} - credential type, e.g ['Credential', 'ProofOfNameCredential']
   */
  @Expose()
  get type(): string[] {
    return this._type
  }

  set type(type: string[]) {
    this._type = type
  }

  /**
   * @description - Returns the signature value
   * @returns {string} - The signature encoded as hex
   */
  get signatureValue() {
    return this._proof.signatureValue
  }

  set signatureValue(signature: string) {
    this._proof.signatureValue = signature
  }

  /**
   * @description - Returns metadata related to the signing key
   * @returns {ISigner} - The did of the signer, and the id of the public key
   * @see{@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}
   */
  get signer(): ISigner {
    return {
      did: this.issuer,
      keyId: this._proof.creator
    }
  }

  /**
   * @description - Returns the expiry date of the credential
   * @returns {Date} - expiry date
   */
  @Expose()
  @Transform((value: Date) => value && value.toISOString(), { toPlainOnly: true })
  @Transform((value: string) => value && new Date(value), { toClassOnly: true })
  get expires(): Date {
    return this._expires
  }

  set expires(expiry: Date) {
    this._expires = expiry
  }

  /**
   * @description - Returns the {@link EcdsaLinkedDataSignature} member of the instance
   * @returns {ILinkedDataSignature} - the proof section of the credential
   */
  @Expose()
  @Type(() => EcdsaLinkedDataSignature)
  @Transform(value => value || new EcdsaLinkedDataSignature(), { toClassOnly: true })
  get proof(): ILinkedDataSignature {
    return this._proof
  }

  set proof(proof: ILinkedDataSignature) {
    this._proof = proof
  }

  /**
   * @description - Returns the did of the credential subject
   * @returns {string} - the did of the subject
   */
  get subject(): string {
    return this.claim.id
  }

  set subject(subject: string) {
    this.claim.id = subject
  }

  /**
   * @description - Returns the claim section from the credential
   * @returns {IClaimSection} - the claim section of the credential
   */
  @Expose()
  get claim(): IClaimSection {
    return this._claim
  }

  set claim(claim: IClaimSection) {
    this._claim = claim
  }

  /**
   * @description - Returns a presentable credential name if present
   * @returns {string | 'Credential'} - credential name, e.g. 'Email', 'Name'
   * @default 'Credential'
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

  set name(name: string) {
    this._name = name
  }

  /**
   * @TODO - better way to pass arguments
   * @description - Instantiates a {@link SignedCredential} based on passed options
   * @param params - Options for creating credential, and for deriving public signing key
   * @param params.metadata - Metadata necessary to create a valid JSON-LD document, see {@link https://jolocom-lib.readthedocs.io/en/latest/signedCredentials.html | documentation}
   * @param params.claim - Data to store in claim, e.g. { email: 'test@gmail.com' }
   * @param params.subject - Did of the credential subject
   *
   * @param issInfo - Public data data
   * @param issInfo.keyId - Public key identifier, as defined in the {@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}.
   * @param issInfo.issuerDid: The did of the credential issuer
   * @returns {Object} - Instance of Credential class
   */
  public static async create<T extends BaseMetadata>(params: ISignedCredCreationArgs<T>, issInfo: IIssInfo) {
    const credential = Credential.create(params)
    const json = credential.toJSON() as ISignedCredentialAttrs
    const signedCredential = SignedCredential.fromJSON(json)
    signedCredential.claim

    signedCredential.prepareSignature(issInfo.keyId)
    signedCredential.issuer = issInfo.issuerDid

    return signedCredential
  }

  /**
   * @description - Sets all fields on the instance necessary to compute the signature
   * @param keyId - Public key identifier, as defined in the {@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}.
   * @returns {void}
   */
  private async prepareSignature(keyId: string) {
    const inOneYear = new Date()
    inOneYear.setFullYear(new Date().getFullYear() + 1)

    this.issued = new Date()
    this.expires = inOneYear

    this.proof.creator = keyId
    this.proof.signatureValue = ''
    this.proof.nonce = SoftwareKeyProvider.getRandom(8).toString('hex')
  }

  /**
   * @description - Returns the sha256 hash of the did document, per {@link https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm | specification}.
   * @returns {Buffer} - sha256 hash of the normalized document
   */
  public async digest(): Promise<Buffer> {
    const normalized = await this.normalize()
    return sha256(Buffer.from(normalized))
  }

  /**
   * @description - Converts the verifiable credential to canonical form
   * @see {@link https://w3c-dvcg.github.io/ld-signatures/#dfn-canonicalization-algorithm | Canonicalization algorithm }
   * @returns {Object} - Document in normalized form, quads
   */
  private async normalize(): Promise<string> {
    const json = this.toJSON()
    delete json.proof

    return canonize(json)
  }

  /**
   * @description - Instantiates a {@link SignedCredential} from it's JSON form
   * @param json - Verifiable Credential in JSON-LD form
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   * @returns {Credential}
   */
  public static fromJSON(json: ISignedCredentialAttrs): SignedCredential {
    return plainToClass(SignedCredential, json)
  }

  /**
   * @description - Serializes the {@link SignedCredential} as JSON-LD
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   * @returns {ISignedCredentialAttrs} - A JSON-LD encoded verifiable credential
   */
  public toJSON(): ISignedCredentialAttrs {
    return classToPlain(this) as ISignedCredentialAttrs
  }
}

/**
 * @ignore
 * @description - Helper function generating a random claim id
 * @param length - The length of the random part of the identifier
 * @returns {string} - The identifier
 */
const generateClaimId = (length: number): string => {
  return `claimId:${generateRandomID(length)}`
}
