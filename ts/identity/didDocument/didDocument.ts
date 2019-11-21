import {
  plainToClass,
  classToPlain,
  Type,
  Exclude,
  Expose,
  Transform,
} from 'class-transformer'
import { IDidDocumentAttrs } from './types'
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature'
import {
  AuthenticationSection,
  PublicKeySection,
  ServiceEndpointsSection,
} from './sections'
import { ISigner } from '../../registries/types'
import { ContextEntry } from 'cred-types-jolocom-core'
import { defaultContextIdentity } from '../../utils/contexts'
import { publicKeyToDID } from '../../utils/crypto'
import { digestJsonLd } from '../../linkedData'
import {
  ILinkedDataSignature,
  IDigestable,
} from '../../linkedDataSignature/types'
import { SoftwareKeyProvider } from '../../vaultedKeyProvider/softwareProvider'

/**
 * Class modelling a Did Document
 * @see {@link https://w3c-ccg.github.io/did-spec/ | specification}
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
   * Get the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `console.log(didDocument.context) // [{name: 'http://schema.org/name', ...}, {...}]`
   */

  @Expose({ name: '@context' })
  get context(): ContextEntry[] {
    return this['_@context']
  }

  /**
   * Set the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `didDocument.context = [{name: 'http://schema.org/name', ...}, {...}]`
   */

  set context(context: ContextEntry[]) {
    this['_@context'] = context
  }

  /**
   * Get the did associated with the did document
   * @example `console.log(didDocument.id) //claimId:25453fa543da7`
   */

  @Expose({ name: 'id' })
  get did(): string {
    return this._id
  }

  /**
   * Set the did associated with the did document
   * @example `didDocument.id = 'claimId:25453fa543da7'`
   */

  set did(did: string) {
    this._id = did
  }

  /**
   * Get the did document authentication sections
   * @example `console.log(didDocument.authentication) // [AuthenticationSection {...}, ...]`
   */

  @Expose()
  @Type(() => AuthenticationSection)
  get authentication(): AuthenticationSection[] {
    return this._authentication
  }

  /**
   * Set the did document authentication sections
   * @example `didDocument.authentication = [AuthenticationSection {...}, ...]`
   */

  set authentication(authentication: AuthenticationSection[]) {
    this._authentication = authentication
  }

  /**
   * Get the did document public key sections
   * @example `console.log(didDocument.publicKey) // [PublicKeySection {...}, ...]`
   */

  @Expose()
  @Type(() => PublicKeySection)
  get publicKey(): PublicKeySection[] {
    return this._publicKey
  }

  /**
   * Set the did document public key sections
   * @example `didDocument.publicKey = [PublicKeySection {...}, ...]`
   */

  set publicKey(value: PublicKeySection[]) {
    this._publicKey = value
  }

  /**
   * Get the did document service endpoint sections
   * @example `console.log(diddocument.service) // [serviceendpointsection {...}, ...]`
   */

  @Expose()
  @Type(() => ServiceEndpointsSection)
  get service(): ServiceEndpointsSection[] {
    return this._service
  }

  /**
   * Set the did document service endpoint sections
   * @example `didDocument.service = [ServiceEndpointSection {...}, ...]`
   */

  set service(service: ServiceEndpointsSection[]) {
    this._service = service
  }

  /**
   * Get the creation date of the did document
   * @example `console.log(didDocument.issued) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose()
  @Transform((value: Date) => value && value.toISOString(), {
    toPlainOnly: true,
  })
  @Transform((value: string) => value && new Date(value), { toClassOnly: true })
  get created(): Date {
    return this._created
  }

  /**
   * Set the creation date of the did document
   * @example `didDocument.created = new Date('2018-11-11T15:46:09.720Z')`
   */

  set created(value: Date) {
    this._created = value
  }

  /**
   * Get aggregated metadata related to the signing public key
   * @see {@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}
   * @example `console.log(didDocument.signer) // { did: 'did:jolo:...', keyId: 'did:jolo:...#keys-1' }`
   */

  get signer(): ISigner {
    return {
      did: this._id,
      keyId: this._proof.creator,
    }
  }

  /**
   * Get the hex encoded did document signature
   * @example `console.log(didDocument.signature) // '2b8504698e...'`
   */

  get signature(): string {
    return this._proof.signature
  }

  /**
   * Set the hex encoded did document signature
   * @example `didDocument.signature = '2b8504698e...'`
   */

  set signature(signature: string) {
    this._proof.signature = signature
  }

  /**
   * Get the {@link EcdsaLinkedDataSignature} member of the did document instance
   * @example `console.log(didDocument.proof) // EcdsaLinkedDataSignature { ... }`
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
   * Set the {@link EcdsaLinkedDataSignature} member of the did document instance
   * @example `didDocument.proof = new EcdsaLinkedDataSignature()`
   */

  set proof(proof: ILinkedDataSignature) {
    this._proof = proof
  }

  /**
   * Adds a new {@link AuthenticationSection} to the did document instance
   * @param section - Configured {@link AuthenticationSection} instance
   */

  public addAuthSection(section: AuthenticationSection) {
    this.authentication.push(section)
  }

  /**
   * Adds a new {@link PublicKeySection} to the did document instance
   * @param section - Configured {@link PublicKeySection} instance
   */

  public addPublicKeySection(section: PublicKeySection) {
    this.publicKey.push(section)
  }

  /**
   * Adds a new {@link ServiceEndpointsSection} to the did document instance
   * @param section - Configured {@link ServiceEndpointsSection} instance
   */

  public addServiceEndpoint(endpoint: ServiceEndpointsSection) {
    this.service = [endpoint]
  }

  /**
   * Clears all {@link ServiceEndpointSection} members from the instance, usefull when removing all public profile data
   * @example `didDocument.resetServiceEndpoints()`
   */

  public resetServiceEndpoints() {
    this.service = []
  }

  /**
   * Instantiates a barebones {@link DidDocument} class based on a public key
   * @param publicKey - A secp256k1 public key that will be listed in the did document
   * @example `const didDocument = DidDocument.fromPublicKey(Buffer.from('abc...ffe', 'hex'))`
   */

  public static fromPublicKey(publicKey: Buffer): DidDocument {
    const did = publicKeyToDID(publicKey)
    const keyId = `${did}#keys-1`

    const didDocument = new DidDocument()
    didDocument.did = did
    didDocument.addPublicKeySection(
      PublicKeySection.fromEcdsa(publicKey, keyId, did),
    )
    didDocument.addAuthSection(
      AuthenticationSection.fromEcdsa(didDocument.publicKey[0]),
    )
    didDocument.prepareSignature(keyId)

    return didDocument
  }

  /**
   * Sets all fields on the instance necessary to compute the signature
   * @param keyId - Public key identifier, as defined in the {@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}.
   * @example `didDocument.prepareSignature('did:jolo:...#keys-1')`
   */

  private prepareSignature(keyId: string) {
    const inOneYear = new Date()
    inOneYear.setFullYear(new Date().getFullYear() + 1)

    this._proof = new EcdsaLinkedDataSignature()
    this._proof.creator = keyId
    this._proof.signature = ''
    this._proof.nonce = SoftwareKeyProvider.getRandom(8).toString('hex')
  }

  /**
   * Returns the sha256 hash of the did document, per {@link https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm | specification}.
   * @internal
   */

  public async digest(): Promise<Buffer> {
      return digestJsonLd(this.toJSON())
  }

  /**
   * Serializes the {@link DidDocument} as JSON-LD
   */

  public toJSON(): IDidDocumentAttrs {
    return classToPlain(this) as IDidDocumentAttrs
  }

  /**
   * Instantiates a {@link DidDocument} from it's JSON form
   * @param json - Verifiable Credential in JSON-LD form
   */

  public static fromJSON(json: IDidDocumentAttrs): DidDocument {
    return plainToClass(DidDocument, json)
  }
}
