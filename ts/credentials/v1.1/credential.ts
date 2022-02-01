import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { ICredentialAttrs, IClaimSection } from '../types'
import { BaseMetadata } from '@jolocom/protocol-ts'
import { defaultContext } from '../../utils/contexts'
import { ISignedCredCreationArgs } from '../types'
import { JsonLdContext } from '../../linkedData/types'
import { SignedCredential } from './signedCredential'
import { randomBytes } from 'crypto'

/**
 * @class
 * Class representing an unsigned verifiable credential.
 * @see {@link https://w3c.github.io/vc-data-model/ | verifiable credential specification}
 */

@Exclude()
export class Credential {
  protected '_@context': JsonLdContext
  // TODO Replace with UUID
  protected _id: string = randomBytes(8).toString('hex')
  protected _type: string[]
  protected _claim: IClaimSection

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
  get credentialSubject(): IClaimSection {
    return this._claim
  }

  /**
   * Set the `claim` section of the credential
   * @example `credential.claim = { id: 'did:jolo:abcde', name: 'Example' }`
   */

  set credentialSubject(claim: IClaimSection) {
    this._claim = claim
  }

  /**
   * Get the type of the credential
   * @example `console.log(credential.type) // ['Credential', 'ProofOf...Credential']`
   */

  @Expose()
  get type(): string[] {
    return this._type
  }

  /**
   * Set the type of the credential
   * @example `credential.type = ['Credential', 'ProofOf...Credential']`
   */

  set type(type: string[]) {
    this._type = type
  }

  /**
   * Get the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `console.log(credential.context) // [{name: 'http://schema.org/name', ...}, {...}]`
   */

  @Expose({ name: '@context' })
  public get context(): JsonLdContext {
    return this['_@context']
  }

  /**
   * Set the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `credential.context = [{name: 'http://schema.org/name', ...}, {...}]`
   */

  public set context(context: JsonLdContext) {
    this['_@context'] = context
  }

  /**
   * Instantiates a {@link Credential} based on passed options
   * @param metadata - metadata necessary to create a valid JSON-LD document
   * @param claim - the `claim` section
   * @param subject - the did of the subject / receiver
   * @see {@link https://jolocom-lib.readthedocs.io/en/latest/signedCredentials.html | developer documentation}
   * @todo Make this available without having to directly import the {@link Credential} class
   * @example [[include:credential.create.md]]
   */

  public static build<T extends BaseMetadata>({
    metadata,
    claim,
    subject,
  }: ISignedCredCreationArgs<T>) {
    const credential = new Credential()

    credential.context = [
      'https://www.w3.org/2018/credentials/v1',
      metadata.context[0],
    ]
    credential.type = ['VerifiableCredential', metadata.type[1]]
    credential.credentialSubject = claim
    credential.credentialSubject.id = subject
    credential.id = `claimId:${randomBytes(8).toString('hex')}`

    return credential
  }

  /**
   * Instantiates a {@link SignedCredential} based on overlapping properties
   * from the {@link Credential} instance. Some properties i.e. issuer, issuance date, proofs
   * can not be set at this point
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   * @example `const verifiableCredential = Credential.toVerifiableCredential()`
   */

  public toVerifiableCredential() {
    const signedCred = new SignedCredential()

    signedCred.id = this.id
    signedCred.type = this.type
    signedCred.context = this.context
    signedCred.credentialSubject = this.credentialSubject
    signedCred.proof = []
    return signedCred
  }

  /**
   * Instantiates a {@link Credential} from it's JSON-LD form
   * @param json - credential encoded as JSON-LD
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   * @example `const credential = Credential.fromJSON({...})`
   */

  public static fromJSON(json: ICredentialAttrs): Credential {
    return plainToClass(Credential, json)
  }

  /**
   * Serializes the {@link Credential} as a JSON-LD document
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   * @example `console.log(credential.toJSON()) // Verifiable credential in JSON-LD form`
   */

  public toJSON(): ICredentialAttrs {
    return classToPlain(this) as ICredentialAttrs
  }
}
