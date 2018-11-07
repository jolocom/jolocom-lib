import { Transform, plainToClass, classToPlain, Type, Exclude, Expose } from 'class-transformer'
import { IDidDocumentAttrs } from './types'
import { canonize } from 'jsonld'
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature'
import { AuthenticationSection, PublicKeySection, ServiceEndpointsSection } from './sections'
import { ISigner } from '../../registries/types'
import { ContextEntry } from 'cred-types-jolocom-core'
import { defaultContextIdentity } from '../../utils/contexts'
import { sha256, publicKeyToDID } from '../../utils/crypto'
import { ILinkedDataSignature, IDigestable } from '../../linkedDataSignature/types'
import { SoftwareKeyProvider } from '../../vaultedKeyProvider/softwareProvider'

/**
 * @class Represents a did document
 */
@Exclude()
export class DidDocument implements IDigestable {
  @Expose()
  @Type(() => AuthenticationSection)
  private authentication: AuthenticationSection[] = []

  @Expose()
  @Type(() => PublicKeySection)
  private publicKey: PublicKeySection[] = []

  @Expose()
  @Type(() => ServiceEndpointsSection)
  private service: ServiceEndpointsSection[] = []

  /**
   * When toJSON is called, convert date to ISO string format,
   * when fromJSON is called, parse value if exists, else default to now
   */

  @Expose()
  @Type(() => Date)
  @Transform((value: Date) => value.toISOString(), { toPlainOnly: true })
  @Transform((value: string) => new Date(value), { toClassOnly: true })
  private created: Date = new Date()

  @Expose()
  @Type(() => EcdsaLinkedDataSignature)
  private proof: ILinkedDataSignature

  @Expose()
  private '@context': ContextEntry[] = defaultContextIdentity

  @Expose()
  private id: string

  public getDid(): string {
    return this.id
  }

  public getAuthSections(): AuthenticationSection[] {
    return this.authentication
  }

  public getPublicKeySections(): PublicKeySection[] {
    return this.publicKey
  }

  public getServiceEndpointSections(): ServiceEndpointsSection[] {
    return this.service
  }

  public getCreationDate(): Date {
    return this.created
  }

  public getContext(): ContextEntry[] {
    return this['@context']
  }

  public getProof(): ILinkedDataSignature {
    return this.proof
  }

  public getSignatureValue(): Buffer {
    return this.proof.getSignatureValue()
  }

  public getSigner(): ISigner {
    return {
      did: this.getDid(),
      keyId: this.proof.getCreator()
    }
  }

  public setDid(did: string) {
    this.id = did
  }

  public setSignatureValue(signature: string) {
    this.proof.setSignatureValue(signature)
  }

  /**
   * @description - Adds a new {@link AuthenticationSection} to the Did Document
   * @param section - Instantiated and populated {@link AuthenticationSection} instance
   * @returns {void}
   */

  public addAuthSection(section: AuthenticationSection) {
    this.authentication.push(section)
  }

  /**
   * @description - Adds a new {@link PublicKeySection} to the Did Document
   * @param section - Instantiated and populated {@link PublicKeySection} instance
   * @returns {void}
   */

  public addPublicKeySection(section: PublicKeySection) {
    this.publicKey.push(section)
  }

  /**
   * @description - Adds a new {@link ServiceEndpointsSection} to the Did Document
   * @param section - Instantiated and populated {@link ServiceEndpointsSection} instance
   * @returns {void}
   */

  public addServiceEndpoint(endpoint: ServiceEndpointsSection) {
    this.service = [endpoint]
  }

  /**
   * @description - Clears the service endpoints section, usefull when removing all public profile data
   * @returns {void}
   */

  public resetServiceEndpoints() {
    this.service = []
  }

  /**
   * @description - Instantiates a barebones {@link DidDocument} class based on a public key
   * @param publicKey - A secp256k1 public key that will be listed in the did document
   * @returns {DidDocument}
   */

  public static fromPublicKey(publicKey: Buffer): DidDocument {
    const did = publicKeyToDID(publicKey)
    const keyId = `${did}#keys-1`

    const didDocument = new DidDocument()
    didDocument.setDid(did)
    didDocument.addPublicKeySection(PublicKeySection.fromEcdsa(publicKey, keyId, did))
    didDocument.addAuthSection(AuthenticationSection.fromEcdsa(didDocument.getPublicKeySections()[0]))
    didDocument.prepareSignature(keyId)

    return didDocument
  }

  /**
   * @description - Sets all fields on the instance necessary to compute the signature
   * @param keyId - Public key identifier, as defined in the {@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}.
   * @returns {void}
   */

  private async prepareSignature(keyId: string) {
    const inOneYear = new Date()
    inOneYear.setFullYear(new Date().getFullYear() + 1)

    this.proof = new EcdsaLinkedDataSignature()
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
   * @description - Converts the did document to canonical form
   * @see {@link https://w3c-dvcg.github.io/ld-signatures/#dfn-canonicalization-algorithm | Canonicalization algorithm }
   * @returns {Object} - Document in normalized form, quads
  */

  public async normalize(): Promise<string> {
    const json = this.toJSON()
    delete json.proof
    return canonize(json)
  }

  public toJSON(): IDidDocumentAttrs {
    return classToPlain(this) as IDidDocumentAttrs
  }

  public static fromJSON(json: IDidDocumentAttrs): DidDocument {
    return plainToClass(DidDocument, json)
  }
}
