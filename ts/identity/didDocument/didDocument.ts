import { plainToClass, classToPlain, Type, Exclude, Expose, Transform } from 'class-transformer'
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
  private _id: string
  private _authentication: AuthenticationSection[] = []
  private _publicKey: PublicKeySection[] = []
  private _service: ServiceEndpointsSection[] = []
  private _created: Date = new Date()
  private _proof: ILinkedDataSignature
  private '_@context': ContextEntry[] = defaultContextIdentity

  /**
   * @description - Returns a presentable credential name if present
   * @returns {ContextEntry[]} - the '@context' section of the JSON-LD document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   */
  @Expose({ name: '@context' })
  public get context(): ContextEntry[] {
    return this['_@context']
  }

  public set context(context: ContextEntry[]) {
    this['_@context'] = context
  }

  @Expose({ name: 'id' })
  get did(): string {
    return this._id
  }

  set did(did: string) {
    this._id = did
  }

  /**
   * Getter authentication
   * @return {AuthenticationSection[] }
   */
  @Expose()
  @Type(() => AuthenticationSection)
  get authentication(): AuthenticationSection[] {
    return this._authentication
  }

  set authentication(authentication: AuthenticationSection[]) {
    this._authentication = authentication
  }
  /**
   * Getter publicKey
   * @return {PublicKeySection[] }
   */
  @Expose()
  @Type(() => PublicKeySection)
  public get publicKey(): PublicKeySection[] {
    return this._publicKey
  }

  public set publicKey(value: PublicKeySection[]) {
    this._publicKey = value
  }

  /**
   * Getter service
   * @return {ServiceEndpointsSection[] }
   */
  @Expose()
  @Type(() => ServiceEndpointsSection)
  public get service(): ServiceEndpointsSection[] {
    return this._service
  }

  public set service(value: ServiceEndpointsSection[]) {
    this._service = value
  }

  /**
   * Getter created
   * @return {Date }
   */
  @Expose()
  @Transform((value: Date) => value && value.toISOString(), { toPlainOnly: true })
  @Transform((value: string) => value && new Date(value), { toClassOnly: true })
  public get created(): Date {
    return this._created
  }

  /**
   * Setter created
   * @param {Date } value
   */
  public set created(value: Date) {
    this._created = value
  }

  /**
   * Setter authentication
   * @param {AuthenticationSection[] } value
   */
  get signer(): ISigner {
    return {
      did: this._id,
      keyId: this._proof.creator
    }
  }

  get signatureValue(): string {
    return this._proof.signatureValue
  }

  set signatureValue(signature: string) {
    this._proof.signatureValue = signature
  }

  @Expose()
  @Type(() => EcdsaLinkedDataSignature)
  @Transform(value => value || new EcdsaLinkedDataSignature(), { toClassOnly: true })
  get proof() : ILinkedDataSignature{
    return this._proof
  }

  set proof(proof: ILinkedDataSignature) {
    this._proof = proof
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
    didDocument.did = did
    didDocument.addPublicKeySection(PublicKeySection.fromEcdsa(publicKey, keyId, did))
    didDocument.addAuthSection(AuthenticationSection.fromEcdsa(didDocument.publicKey[0]))
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

    this._proof = new EcdsaLinkedDataSignature()
    this._proof.creator = keyId
    this._proof.signatureValue = ''
    this._proof.nonce = SoftwareKeyProvider.getRandom(8).toString('hex')
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
