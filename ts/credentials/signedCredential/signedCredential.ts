import 'reflect-metadata'
import { Transform, plainToClass, classToPlain, Type, Expose } from 'class-transformer'
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
@Expose()
export class SignedCredential implements IDigestable {
  private '@context': ContextEntry[]

  /* If value is not defined when we revive this class from JSON, default to 8 char random id */
  @Transform((value: string) => value || generateClaimId(8), { toClassOnly: true })
  private id: string = generateClaimId(8)

  private name: string

  private issuer: string

  private type: string[]

  private claim: IClaimSection

  /*
   * When toJSON is called, convert date to ISO string format,
   * when fromJSON is called, parse value if exists, else default to now
   */

  @Type(() => Date)
  @Transform((value: Date) => value.toISOString(), { toPlainOnly: true })
  @Transform((value: string) => (value ? new Date(value) : new Date()), { toClassOnly: true })
  private issued: Date

  @Type(() => Date)
  @Transform((value: Date) => value.toISOString(), { toPlainOnly: true })
  @Transform((value: string) => new Date(value), { toClassOnly: true })
  private expires?: Date

  /* when fromJSON is called, parse value if exists, else default to new EcdsaLinkedDataSignature */

  @Type(() => EcdsaLinkedDataSignature)
  @Transform(value => value || new EcdsaLinkedDataSignature(), { toClassOnly: true })
  private proof = new EcdsaLinkedDataSignature()

  public setIssuer(issuer: string) {
    this.issuer = issuer
  }

  public setIssued(issued: Date) {
    this.issued = issued
  }

  public setExpiry(expiry: Date) {
    this.expires = expiry
  }

  /**
   * @description - Returns the credential identifier
   * @returns {string} - The credential identifier
   * @see {@link https://w3c.github.io/vc-data-model/#identifiers | specification}
   */
  public getId(): string {
    return this.id
  }

  /**
   * @description - Returns the credential issue date
   * @returns {Date} - Issue date
   */
  public getIssued(): Date {
    return this.issued
  }

  /**
   * @description - Returns the credential type
   * @returns {string[]} - credential type, e.g ['Credential', 'ProofOfNameCredential']
   */
  public getType(): string[] {
    return this.type
  }

  /**
   * @description - Returns the issuer of the signed credential
   * @returns {string} - The did of the issuer
   */
  public getIssuer(): string {
    return this.issuer
  }

  /**
   * @description - Returns the signature value
   * @returns {string} - The signature encoded as hex
   */
  public getSignatureValue() {
    return this.proof.getSignatureValue()
  }

  public setSignatureValue(signature: string) {
    this.proof.setSignatureValue(signature)
  }

  /**
   * @description - Returns metadata related to the signing key
   * @returns {ISigner} - The did of the signer, and the id of the public key
   * @see{@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}
   */
  public getSigner(): ISigner {
    return {
      did: this.issuer,
      keyId: this.proof.getCreator()
    }
  }

  /**
   * @description - Returns the expiry date of the credential
   * @returns {Date} - expiry date
   */
  public getExpiryDate(): Date {
    return this.expires
  }

  /**
   * @description - Returns the {@link EcdsaLinkedDataSignature} member of the instance
   * @returns {ILinkedDataSignature} - the proof section of the credential
   */
  public getProofSection(): ILinkedDataSignature {
    return this.proof
  }

  /**
   * @description - Returns the did of the credential subject
   * @returns {string} - the did of the subject
   */
  public getSubject(): string {
    return this.claim.id
  }

  public set claims(claims: IClaimSection) {
    this.claim = claims
  }

  /**
   * @description - Returns the claim section from the credential
   * @returns {IClaimSection} - the claim section of the credential
   */
  public get claims(): IClaimSection {
    return this.claim
  }

  /**
   * @description - Returns a presentable credential name if present
   * @returns {string | 'Credential'} - credential name, e.g. 'Email', 'Name'
   * @default 'Credential'
   */
  public getDisplayName(): string {
    if (this.name) {
      return this.name
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
    signedCredential.setIssuer(issInfo.issuerDid)

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

    this.setIssued(new Date())
    this.setExpiry(inOneYear)

    this.proof.setCreator(keyId)
    this.proof.setSignatureValue('')
    this.proof.setNonce(SoftwareKeyProvider.getRandom(8).toString('hex'))
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
