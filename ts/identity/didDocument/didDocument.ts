import {
  classToPlain,
  ClassTransformOptions,
  Exclude,
  Expose,
  plainToClass,
  Transform,
  Type,
} from 'class-transformer'
import { IDidDocumentAttrs } from '@jolocom/protocol-ts'
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature'
import {
  AuthenticationSection,
  PublicKeySection,
  ServiceEndpointsSection,
} from './sections'
import { defaultContextIdentity } from '../../utils/contexts'
import { getRandomBytes } from '../../utils/crypto'
import { digestJsonLd, normalizeSignedLdObject } from '../../linkedData'
import {
  IDigestable,
  ILinkedDataSignature,
} from '../../linkedDataSignature/types'
import { ContextEntry } from '@jolocom/protocol-ts'
import { ISigner } from '../../credentials/types'
import { IVaultedKeyProvider, IKeyRefArgs } from '@jolocom/vaulted-key-provider'
import { publicKeyToJoloDID } from '../../didMethods/jolo/utils'

/**
 * Class modelling a Did Document
 * @see {@link https://w3c-ccg.github.io/did-spec/ | specification}
 */

const LATEST_SPEC_VERSION = 0.13

@Exclude()
export class DidDocument implements IDigestable {
  private _id: string
  private _specVersion: number = LATEST_SPEC_VERSION
  private _authentication: AuthenticationSection[] = []
  private _publicKey: PublicKeySection[] = []
  private _service: ServiceEndpointsSection[] = []
  private _created: Date = new Date()
  private _updated: Date = new Date()
  private _proof: ILinkedDataSignature = new EcdsaLinkedDataSignature()
  private _context: ContextEntry[] = defaultContextIdentity

  /**
   * The DID spec version
   * This is non-standard; an extension by jolocom
   */
  @Expose({ since: 0.13 })
  public get specVersion() {
    return this._specVersion
  }

  public set specVersion(specVersion: number) {
    this._specVersion = specVersion
  }

  /**
   * Get the `@context` section of the JSON-ld document
   * NOTE: the context from jolocom identities is automatically replaced with
   * the latest from the library when deserializing from JSON
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `console.log(didDocument.context) // [{name: 'http://schema.org/name', ...}, {...}]`
   */

  @Expose({ name: '@context' })
  // TODO Is this needed?
  @Transform(
    (val, obj) => {
      if (obj.id.startsWith('did:jolo')) return defaultContextIdentity
      else return val
    },
    { toClassOnly: true },
  )
  public get context(): ContextEntry[] {
    return this._context
  }

  /**
   * Set the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `didDocument.context = [{name: 'http://schema.org/name', ...}, {...}]`
   */

  public set context(context: ContextEntry[]) {
    this._context = context
  }

  /**
   * Get the did associated with the did document
   * @example `console.log(didDocument.id) //claimId:25453fa543da7`
   */

  @Expose({ name: 'id' })
  public get did(): string {
    return this._id
  }

  /**
   * Set the did associated with the did document
   * @example `didDocument.id = 'claimId:25453fa543da7'`
   */

  public set did(did: string) {
    this._id = did
  }

  /**
   * Get the did document authentication sections
   * @example `console.log(didDocument.authentication) // [AuthenticationSection {...}, ...]`
   */

  @Expose()
  @Transform(
    auths =>
      auths &&
      auths.map(val => {
        const { type, publicKey } = val
        return type === 'Secp256k1SignatureAuthentication2018' && !!publicKey
          ? publicKey
          : PublicKeySection.fromJSON(val)
      }),
    { toClassOnly: true },
  )
  public get authentication(): AuthenticationSection[] {
    return this._authentication
  }

  /**
   * Set the did document authentication sections
   * @example `didDocument.authentication = [AuthenticationSection {...}, ...]`
   */

  public set authentication(authentication: AuthenticationSection[]) {
    authentication &&
      authentication.forEach(el => {
        if (typeof el === 'string') {
          this._authentication.push(el)
        } else {
          this._authentication.push(el.id)
          this._publicKey.push(el)
        }
      })
    this._authentication = authentication
  }

  /**
   * Get the did document public key sections
   * @example `console.log(didDocument.publicKey) // [PublicKeySection {...}, ...]`
   */

  @Expose()
  @Transform(
    (pubKeys, rest) => {
      const { verificationMethod } = rest
      if (verificationMethod && verificationMethod.length) {
        return [...(pubKeys || []), ...verificationMethod]
      }

      return pubKeys || []
    },
    { toClassOnly: true },
  )
  @Transform(pubKeys => pubKeys && pubKeys.map(PublicKeySection.fromJSON))
  public get publicKey(): PublicKeySection[] {
    return this._publicKey
  }

  /**
   * Set the did document public key sections
   * @example `didDocument.publicKey = [PublicKeySection {...}, ...]`
   */

  public set publicKey(value: PublicKeySection[]) {
    this._publicKey = value
  }

  /**
   * Helper function, which when given a keyId, will
   * try find the appropriate publicKeySection on the Did Document and return it
   */

  public findPublicKeySectionById(keyId: string) {
    return this._publicKey.find(
      ({ id }) => id === keyId || id === `#${keyId.split('#').pop()}`,
    )
  }

  /**
   * Get the did document service endpoint sections
   * @example `console.log(diddocument.service) // [serviceendpointsection {...}, ...]`
   */

  @Expose()
  @Type(() => ServiceEndpointsSection)
  public get service(): ServiceEndpointsSection[] {
    return this._service
  }

  /**
   * Set the did document service endpoint sections
   * @example `didDocument.service = [ServiceEndpointSection {...}, ...]`
   */

  public set service(service: ServiceEndpointsSection[]) {
    this._service = service
  }

  /**
   * Get the creation date of the did document
   * @example `console.log(didDocument.created) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose()
  @Transform((value: Date) => value && value.toISOString(), {
    toPlainOnly: true,
  })
  @Transform((value: string) => value && new Date(value), { toClassOnly: true })
  public get created(): Date {
    return this._created
  }

  /**
   * Set the creation date of the did document
   * @example `didDocument.created = new Date('2018-11-11T15:46:09.720Z')`
   */

  public set created(value: Date) {
    this._created = value
  }

  /**
   * Get the updated date of the did document
   * @example `console.log(didDocument.updated) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose({ since: 0.13 })
  @Transform((value: Date) => value && value.toISOString(), {
    toPlainOnly: true,
  })
  @Transform((value: string) => value && new Date(value), { toClassOnly: true })
  public get updated(): Date {
    return this._updated
  }

  /**
   * Set the updated date of the did document
   * @example `didDocument.updated = new Date('2018-11-11T15:46:09.720Z')`
   */

  public set updated(value: Date) {
    this._updated = value
  }

  /**
   * Get aggregated metadata related to the signing public key
   * @see {@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}
   * @example `console.log(didDocument.signer) // { did: 'did:jolo:...', keyId: 'did:jolo:...#keys-1' }`
   */

  public get signer(): ISigner {
    return {
      did: this._id,
      keyId: (this._proof && this._proof.creator) || this._publicKey[0].id,
    }
  }

  /**
   * Get the hex encoded did document signature
   * @example `console.log(didDocument.signature) // '2b8504698e...'`
   */

  public get signature(): string {
    return this._proof.signature
  }

  /**
   * Set the hex encoded did document signature
   * @example `didDocument.signature = '2b8504698e...'`
   */

  public set signature(signature: string) {
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
  public get proof(): ILinkedDataSignature {
    return this._proof
  }

  /**
   * Set the {@link EcdsaLinkedDataSignature} member of the did document instance
   * @example `didDocument.proof = new EcdsaLinkedDataSignature()`
   */

  public set proof(proof: ILinkedDataSignature) {
    this._proof = proof
  }

  /**
   * Adds a new authentication key id to the did document instance
   * @param authenticationKeyId - id string of a public key
   */

  public addAuthKeyId(authenticationKeyId: string): void {
    this._authentication.push(authenticationKeyId)
  }

  /**
   * Adds a new authentication key object to the did document instance
   * @param authenticationKey - public key that should be used for authentication
   */

  public addAuthKey(authenticationKey: PublicKeySection): void {
    this._authentication.push(authenticationKey)
  }

  /**
   * Adds a new {@link PublicKeySection} to the did document instance
   * @param section - Configured {@link PublicKeySection} instance
   */

  public addPublicKeySection(section: PublicKeySection): void {
    this._publicKey.push(section)
  }

  /**
   * Adds a new {@link ServiceEndpointsSection} to the did document instance
   * @param endpoint - Configured {@link ServiceEndpointsSection} instance
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

  public static async fromPublicKey(publicKey: Buffer): Promise<DidDocument> {
    const did = publicKeyToJoloDID(publicKey)
    const keyId = `${did}#keys-1`

    const didDocument = new DidDocument()
    didDocument.did = did
    didDocument.addPublicKeySection(
      PublicKeySection.fromEcdsa(publicKey, keyId, did),
    )
    didDocument.addAuthKeyId(didDocument.publicKey[0].id)
    return didDocument
  }

  /**
   * Sets all fields on the instance necessary to compute the signature
   * @param keyId - Public key identifier, as defined in the {@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}.
   * @example `didDocument.sign(vault, { derivationPath: KeyTypes.jolocomIdentityKey, encryptionPass: 'password', }, keyId)`
   */

  public async sign(
    vaultedKeyProvider: IVaultedKeyProvider,
    signConfig: IKeyRefArgs,
  ): Promise<void> {
    this._proof = new EcdsaLinkedDataSignature()
    this._proof.creator = this.signer.keyId
    this._proof.signature = ''
    this._proof.nonce = (await getRandomBytes(8)).toString('hex')

    const signature = await vaultedKeyProvider.sign(
      signConfig,
      await this.asBytes(),
    )

    this._proof.signature = signature.toString('hex')
  }

  public async asBytes(): Promise<Buffer> {
    //@ts-ignore optional proof causing issues
    return normalizeSignedLdObject(this.toJSON(), this.context)
  }

  /**
   * Returns the sha256 hash of the did document, per {@link https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm | specification}.
   * @internal
   */

  public async digest(): Promise<Buffer> {
    // @ts-ignore TODO Optional proof
    return digestJsonLd(this.toJSON(), this.context)
  }

  /**
   * Updates the updated field of the DID Document to the current Date and Time.
   * Should always be called on DID Document updates.
   */
  public hasBeenUpdated(): void {
    this._updated = new Date()
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
    const options: ClassTransformOptions | undefined = json.id.startsWith(
      'did:jolo',
    )
      ? { version: json.specVersion || 0 }
      : undefined

    return plainToClass(DidDocument, json, options)
  }
}
