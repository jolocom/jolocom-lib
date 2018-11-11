import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { ICredentialAttrs, IClaimSection } from './types'
import { BaseMetadata, ContextEntry } from 'cred-types-jolocom-core'
import { defaultContext } from '../../utils/contexts'
import { ISignedCredCreationArgs } from '../signedCredential/types'

/**
 * @class
 * Class representing an unsigned verifiable credential.
 * @see {@link https://w3c.github.io/vc-data-model/ | verifiable credential specification}
 */

@Exclude()
export class Credential {
  private '_@context': ContextEntry[]
  private _id: string
  private _type: string[]
  private _claim: IClaimSection
  private _name: string

  /**
   * Get the identifier of the credential
   * @example `console.log(credential.id) //claimId:25453fa543da7`
   */

  get id() {
    return this._id
  }

  /**
   * Set the identifier of the credential
   * @example `credential.id = 'claimId:2543fa543da7'`
   */

  set id(id: string) {
    this._id = id
  }

  /**
   * Get the `claim` section of the credential
   * @example `console.log(credential.claim) // { id: 'did:jolo:abcde', name: 'Example' }`
   */

  @Expose()
  get claim(): IClaimSection {
    return this._claim
  }

  /**
   * Set the `claim` section of the credential
   * @example `credential.claim = { id: 'did:jolo:abcde', name: 'Example' }`
   */

  set claim(claim: IClaimSection) {
    this._claim = claim
  }

  /**
   * Get the type of the credential
   * @returns {string[]}
   * @example `console.log(credentia.type) //['Credential', 'ProofOf...Credential']`
   */
  @Expose()
  get type(): string[] {
    return this._type
  }

  /**
   * Set the type of the credential
   * @example `credentia.type = ['Credential', 'ProofOf...Credential']`
   */
  set type(type: string[]) {
    this._type = type
  }

  /**
   * Get a presentable credential name if present
   * @returns {string | undefined}
   * @example `console.log(credentia.name) // 'Email'`
   */

  @Expose()
  get name(): string {
    return this._name
  }

  /**
   * Set a presentable credential name
   * @example `credentia.name = 'Email'`
   */

  set name(name: string) {
    this._name = name
  }

  /**
   * Get the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `console.log(credentia.context) // [{name: 'http://schema.org/name', ...}, {...}]`
   */

  @Expose({ name: '@context' })
  public get context(): ContextEntry[] {
    return this['_@context']
  }

  /**
   * Set the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `credentia.context = [{name: 'http://schema.org/name', ...}, {...}]`
   */

  public set context(context: ContextEntry[]) {
    this['_@context'] = context
  }

  /**
   * Instantiates a {@link Credential} based on passed options
   * @param metadata - metadata necessary to create a valid JSON-LD document
   * @param claim - the `claim` section
   * @param subject - the did of the subject / receiver
   * @see {@link https://jolocom-lib.readthedocs.io/en/latest/signedCredentials.html | developer documentation}
   * @returns {Credential}
   * @todo Make this available without having to directly import the {@link Credential} class
   * @example [[include:credential.create.md]]
   */

  public static create<T extends BaseMetadata>({ metadata, claim, subject }: ISignedCredCreationArgs<T>) {
    const credential = new Credential()
    credential.context = [...defaultContext, ...metadata.context]
    credential.type = metadata.type
    credential.name = metadata.name
    credential.claim = claim
    credential.claim.id = subject

    return credential
  }

  /**
   * Instantiates a {@link Credential} from it's JSON-LD form
   * @param json - credential encoded as JSON-LD
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   * @returns {Credential}
   * @example `const credential = Credentia.fromJSON({...})`
   */

  public static fromJSON(json: ICredentialAttrs): Credential {
    return plainToClass(Credential, json)
  }

  /**
   * Serializes the {@link Credential} as a JSON-LD document
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   * @returns {ICredentialAttrs}
   * @example `console.log(credential.toJSON()) // Verifiable credential in JSON-LD form`
   */

  public toJSON(): ICredentialAttrs {
    return classToPlain(this) as ICredentialAttrs
  }
}
