import {
  classToPlain,
  Exclude,
  Expose,
  plainToClass,
  Transform,
  Type,
} from 'class-transformer'
import { IDidDocumentAttrs } from './types'
import { EcdsaLinkedDataSignature } from '../../linkedDataSignature'
import {
  AuthenticationSection,
  PublicKeySection,
  ServiceEndpointsSection,
} from './sections'
import { ISigner } from '../../registries/types'
import { didDocumentContext } from '../../utils/contexts'
import { publicKeyToDID } from '../../utils/crypto'
import {
  ILinkedDataSignature,
  IDigestible,
} from '../../linkedDataSignature/types'
import { SoftwareKeyProvider } from '../../vaultedKeyProvider/softwareProvider'
import { JsonLdDigestible } from '../../validation/jsonLdValidator'
import {
  IKeyDerivationArgs,
  IVaultedKeyProvider,
} from '../../vaultedKeyProvider/types'
import {
  IAuthenticationSectionAttrs,
  IAuthenticationSectionAttrsv0,
  PublicKeySectionAttrs,
} from './sections/types'
import { JsonLdContext } from '../../utils/contexts/types'

/**
 * Class modelling a Did Document
 * @see {@link https://w3c-ccg.github.io/did-spec/ | specification}
 */

const LATEST_SPEC_VERSION = 0.13

@Exclude()
export class DidDocument implements IDigestible {
  private _id: string
  private _specVersion: number = LATEST_SPEC_VERSION
  private _authentication: AuthenticationSection[] = []
  private _publicKey: PublicKeySection[] = []
  private _service: ServiceEndpointsSection[] = []
  private _created: Date = new Date()
  private _updated: Date = new Date()
  private _proof: ILinkedDataSignature
  private _context: JsonLdContext

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
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `console.log(didDocument.context) // [{name: 'http://schema.org/name', ...}, {...}]`
   */

  @Expose({ name: '@context' })
  public get context(): JsonLdContext {
    return this._context
  }

  /**
   * Set the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `didDocument.context = [{name: 'http://schema.org/name', ...}, {...}]`
   */

  public set context(context: JsonLdContext) {
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

  @Expose({ name: 'authentication' })
  @Transform(
    (auths: IAuthenticationSectionAttrsv0[]) =>
      auths.map(authEntry => authEntry.publicKey),
    { toClassOnly: true, until: 0.13 },
  )
  @Transform(
    (auths: IAuthenticationSectionAttrs[], json) =>
      auths.map(authEntry =>
        typeof authEntry === 'string'
          ? authEntry
          : PublicKeySection.fromJSON(authEntry, {
              version: getDidDocVersion(json),
            }),
      ),
    { toClassOnly: true, since: 0.13 },
  )
  @Transform(
    (auths: AuthenticationSection[]) =>
      auths.map(authEntry =>
        typeof authEntry === 'string' ? authEntry : authEntry.toJSON(),
      ),
    { toPlainOnly: true },
  )
  public get authentication(): AuthenticationSection[] {
    return this._authentication
  }

  /**
   * Set the did document authentication sections
   * @example `didDocument.authentication = [AuthenticationSection {...}, ...]`
   */

  public set authentication(authentication: AuthenticationSection[]) {
    this._authentication = authentication
  }

  /**
   * Get the did document public key sections
   * @example `console.log(didDocument.publicKey) // [PublicKeySection {...}, ...]`
   */

  @Expose()
  @Transform(
    (sectionAttrs: PublicKeySectionAttrs[], json) =>
      sectionAttrs.map(sec =>
        PublicKeySection.fromJSON(sec, { version: getDidDocVersion(json) }),
      ),
    { toClassOnly: true },
  )
  @Transform(
    (sections: PublicKeySection[]) => sections.map(sec => sec.toJSON()),
    { toPlainOnly: true },
  )
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
   * Get the did document service endpoint sections
   * @example `console.log(didDocument.service) // [serviceEndpointSection {...}, ...]`
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
      keyId: this._proof.creator,
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
    this.authentication.push(authenticationKeyId)
  }

  /**
   * Adds a new authentication key object to the did document instance
   * @param authenticationKey - public key that should be used for authentication
   */

  public addAuthKey(authenticationKey: PublicKeySection): void {
    this.authentication.push(authenticationKey)
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

  public static fromPublicKey(publicKey: Buffer): DidDocument {
    const did = publicKeyToDID(publicKey)
    const keyId = `${did}#keys-1`

    const didDocument = new DidDocument()
    didDocument.context = didDocumentContext
    didDocument.did = did
    didDocument.addPublicKeySection(
      PublicKeySection.fromEcdsa(publicKey, keyId, did),
    )
    didDocument.addAuthKeyId(didDocument.publicKey[0].id)
    return didDocument
  }

  /**
   * Sets all fields on the instance necessary to compute the signature and signes the DID Document
   * @param vaultedKeyProvider VaultedKeyProvider instance the holds the private key to sign the DID Document
   * @param derivationArgs Should contain the derivation path and the password for the key provider
   * @param keyId - Public key identifier, as defined in the {@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}.
   * @example `didDocument.sign(vault, { derivationPath: KeyTypes.jolocomIdentityKey, encryptionPass: 'password', }, keyId)`
   */

  public async sign(
    vaultedKeyProvider: IVaultedKeyProvider,
    derivationArgs: IKeyDerivationArgs,
    keyId: string,
  ): Promise<void> {
    this._proof = new EcdsaLinkedDataSignature()
    this._proof.creator = keyId
    this._proof.signature = ''
    this._proof.nonce = SoftwareKeyProvider.getRandom(8).toString('hex')

    const didDocumentSignature = await vaultedKeyProvider.signDigestible(
      derivationArgs,
      this,
    )
    this._proof.signature = didDocumentSignature.toString('hex')
  }

  /**
   * Returns the sha256 hash of the did document, per {@link https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm | specification}.
   * @internal
   */

  public async digest(): Promise<Buffer> {
    return new JsonLdDigestible(this.toJSON()).digest()
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
    return plainToClass(DidDocument, json, {
      version: getDidDocVersion(json),
    })
  }
}

const getDidDocVersion = ({ specVersion, id }: IDidDocumentAttrs) => {
  if (id.startsWith('did:jolo')) {
    return specVersion || 0
  }

  return 0
}
