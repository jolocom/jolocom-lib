import 'reflect-metadata'
import { Transform, plainToClass, classToPlain, Type, Exclude, Expose } from 'class-transformer'
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

/* Data needed to prepare signature on credential */

interface IIssInfo {
  keyId: string
  issuerDid: string
}

/*
 * Class representing an JSON LD verifiable credential. Contains a Credential
 *  linked data signature, and methods to aid digesting / signing.
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

  public getId(): string {
    return this.id
  }

  public getIssued(): Date {
    return this.issued
  }

  public getType(): string[] {
    return this.type
  }

  public getIssuer(): string {
    return this.issuer
  }

  public getSignatureValue() {
    return this.proof.getSignatureValue()
  }

  public setSignatureValue(signature: string) {
    this.proof.setSignatureValue(signature)
  }

  public getSigner(): ISigner {
    return {
      did: this.issuer,
      keyId: this.proof.getCreator()
    }
  }

  public getExpiryDate(): Date {
    return this.expires
  }

  public getProofSection(): ILinkedDataSignature {
    return this.proof
  }

  public getSubject(): string {
    return this.claim.id
  }

  public getClaims(): IClaimSection {
    return this.claim
  }

  /*
   * @description - Returns a presentable credential name if present, if not defaults to 'Credential'
   * @returns {string} - Credential name
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

  /*
   * @TODO - better way to pass arguments
   * @description - Instantiates a Signed Credential based on passed configuration
   * @param params - Options for creating credential, and for deriving public signing key
   * @param params.metadata - Metadata necessary to create a valid JSON-LD document
   *   see - https://jolocom-lib.readthedocs.io/en/latest/signedCredentials.html
   * @param params.claim - Data to store in claim, e.g. { email: 'test@gmail.com' }
   * @param params.subject - Did of the credential subject
   * 
   * @param issInfo - Public data related to credential issuer
   * @param issInfo.keyId - Id of the public key creating the signature, e.g. did:jolo...#keys-1
   * @param issInfo.issuerDid: The did of the credential issuer
   * @returns {Object} - Instance of Credential class
  */

  public static async create<T extends BaseMetadata>(params: ISignedCredCreationArgs<T>, issInfo: IIssInfo) {
    const credential = Credential.create(params)
    const json = credential.toJSON() as ISignedCredentialAttrs
    const signedCredential = SignedCredential.fromJSON(json)

    signedCredential.prepareSignature(issInfo.keyId)
    signedCredential.setIssuer(issInfo.issuerDid)

    return signedCredential
  }

  /*
   * @description - Populates all fields necessary to compute signaturea, signature
   *  is computed at a later point due to restricted access to private keys
   * @param keyId - Public key identifier, e.g. did:jolo:abcdef...ff#keys-1
   * @returns {void} - Mutates the instance
  */

  private async prepareSignature(keyId: string) {
    const inOneYear = new Date()
    inOneYear.setFullYear(new Date().getFullYear() + 1)

    this.setExpiry(inOneYear)

    this.proof.setCreator(keyId)
    this.proof.setSignatureValue('')
    this.proof.setNonce(SoftwareKeyProvider.getRandom(8).toString('hex'))
  }

  /*
   * @description - Computes a 256 bit digest that can be signed later
   * @returns {Buffer} - 32 byte sha256 digest of normalized JSON-LD document
  */

  public async digest(): Promise<Buffer> {
    const normalized = await this.normalize()
    return sha256(Buffer.from(normalized))
  }

  /*
   * @description - Converts JSON-LD document to canonical form, see https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm
   * @returns {Object} - Document in normalized form, quads
  */

  private async normalize(): Promise<string> {
    const json = this.toJSON()
    delete json.proof

    return canonize(json)
  }

  /*
   * @description - Normalizes the JSON-LD representation of the class instance,
   *   and computes it's sha256 hash
   * @returns {Buffer} - sha256 hash of the normalized document
  */

  public static fromJSON(json: ISignedCredentialAttrs): SignedCredential {
    return plainToClass(SignedCredential, json)
  }

  public toJSON(): ISignedCredentialAttrs {
    return classToPlain(this) as ISignedCredentialAttrs
  }
}

/*
  * @description - Helper function generating a random claim id
  * @param length - The length of the random part of the identifier
  * @returns {string} - The identifier
*/

const generateClaimId = (length: number): string => {
  return `claimId:${generateRandomID(length)}`
}
