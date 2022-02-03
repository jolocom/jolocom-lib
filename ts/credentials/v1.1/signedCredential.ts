import 'reflect-metadata'
import {
  classToPlain,
  Exclude,
  Expose,
  plainToClass,
  Transform,
} from 'class-transformer'
import { LinkedDataProof, BaseProofOptions, SupportedSuites } from '../../linkedDataSignature'
import { Credential } from './credential'
import {
  BaseMetadata,
  IClaimSection,
  ISignedCredCreationArgs,
  JsonLdContext,
} from '@jolocom/protocol-ts'
import { ErrorCodes } from '../../errors'
import { SuiteImplementation } from '../../linkedDataSignature/mapping'
import { SignedCredentialJSON } from './types'
import { ChainedProof2021 } from '../../linkedDataSignature/suites/chainedProof2021'
import { dateToIsoString } from './util'

// Credentials are valid for a year by default
const DEFAULT_EXPIRY_MS = 365 * 24 * 3600 * 1000

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
export class SignedCredential {
  public readonly credential: Credential = new Credential()
  private _issuer: string
  private _issued: Date
  private _expires?: Date
  private _proof: LinkedDataProof<BaseProofOptions>[] = []
  private _credentialSchema?: Array<{ id: string; type: string }>

  @Expose()
  get credentialSubject(): IClaimSection {
    return this.credential.credentialSubject
  }

  /**
   * Set the `claim` section of the credential
   * @example `credential.claim = { id: 'did:jolo:abcde', name: 'Example' }`
   */

  set credentialSubject(claim: IClaimSection) {
    this.credential.credentialSubject = claim
  }

  /**
   * Get the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `console.log(credential.context) // [{name: 'http://schema.org/name', ...}, {...}]`
   */

  @Expose({ name: '@context' })
  public get context(): JsonLdContext {
    return this.credential['_@context']
  }

  /**
   * Set the `@context` section of the JSON-ld document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   * @example `credential.context = [{name: 'http://schema.org/name', ...}, {...}]`
   */

  public set context(context: JsonLdContext) {
    this.credential['_@context'] = context
  }
  /**
   * Get the identifier of the signed credential
   * @example `console.log(signedCredential.id) //claimId:25453fa543da7`
   */

  @Expose()
  get id(): string {
    return this.credential.id
  }

  /**
   * Set the identifier of the signed credential
   * @example `signedCredential.id = 'claimId:2543fa543da7'`
   */

  set id(id: string) {
    this.credential.id = id
  }

  /**
   * Get the issuer of the signed credential
   * @example `console.log(signedCredential.issuer) // 'did:jolo:abc...'`
   */

  @Expose()
  get issuer(): string {
    return this._issuer
  }

  /**
   * Set the issuer of the signed credential
   * @example `signedCredential.issuer = 'did:jolo:abc...'`
   */

  set issuer(issuer: string) {
    this._issuer = issuer
  }

  /**
   * Get / set the issuance date of the signed credential
   * @example `console.log(signedCredential.issued) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose({ name: 'issuanceDate' })
  @Transform(({ value }) => dateToIsoString(value), {
    toPlainOnly: true,
  })
  @Transform(({ value }) => value && new Date(value), { toClassOnly: true })
  get issued(): Date {
    return this._issued
  }

  set issued(issued: Date) {
    this._issued = issued
  }

  /**
   * Get / set the expiry date of the signed credential
   * @example `console.log(signedCredential.expires) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose({ name: 'expirationDate' })
  @Transform(({ value }) => dateToIsoString(value), {
    toPlainOnly: true,
  })
  @Transform(({ value }) => value && new Date(value), { toClassOnly: true })
  get expires(): Date {
    return this._expires
  }

  /**
   * Get the type of the signed credential
   * @example `console.log(signedCredential.type) // ['Credential', 'ProofOf...Credential']`
   */

  @Expose()
  get type(): string[] {
    return this.credential.type
  }

  /**
   * Set the type of the credential
   * @example `signedCredential.type = ['Credential', 'ProofOf...Credential']`
   */

  set type(type: string[]) {
    this.credential.type = type
  }

  @Expose()
  @Transform(({ value }) => (value && Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  @Transform(({ value }) => value && (value.length === 1 ? value[0] : value), {
    toPlainOnly: true,
  })
  get credentialSchema() {
    return this._credentialSchema
  }

  set credentialSchema(schema: Array<{ id: string; type: string }>) {
    this._credentialSchema = schema
  }

  /**
   * Set the expiry date of the signed credential
   * @example `signedCredential.expires = new Date('2019-11-11T15:46:09.720Z')`
   */

  set expires(expiry: Date) {
    this._expires = expiry
  }

  @Expose()
  @Transform(({ value }) => value.filter((v) => !!v).map((v) => v.toJSON()), {
    toPlainOnly: true,
  })
  @Transform(
    ({ value }) => {
      const proofs = Array.isArray(value) ? value : [value]

      return proofs.map((v) => {
        const dto = SuiteImplementation[v.type]
        if (v.type === SupportedSuites.ChainedProof2021) {
          return ChainedProof2021.fromJSON(v)
        }
        return dto ? dto.impl.fromJSON(v) : undefined
      })
    },
    { toClassOnly: true }
  )
  get proof(): Array<LinkedDataProof<BaseProofOptions>> {
    return this._proof
  }

  set proof(proof: Array<LinkedDataProof<BaseProofOptions>>) {
    this._proof = proof
  }

  addProof(proof: LinkedDataProof<BaseProofOptions>) {
    this._proof.push(proof)
  }

  /**
   * Get the subject of the credential
   * @example `console.log(signedCredential.subject) // 'did:jolo:...'`
   */

  get subject(): string {
    return this.credentialSubject.id
  }

  /**
   * Set the subject of the credential
   * @example `signedCredential.subject = 'did:jolo:...'`
   */

  set subject(subject: string) {
    this.credentialSubject.id = subject
  }

  /**
   * Instantiates a {@link SignedCredential} based on passed options
   * @param credentialOptions - Options for creating credential, and for deriving public signing key
   * @param issInfo - Public data data
   * @param expires - Expiration date for the credential, defaults to 1 year from Date.now()
   * @example [[include:signedCredential.create.md]]
   * @internal
   */

  public static async create<T extends BaseMetadata>(
    credentialOptions: ISignedCredCreationArgs<T>,
    issInfo: IIssInfo,
    expires?: Date
  ) {
    const credential = Credential.build(credentialOptions)

    const { context, id, type, credentialSubject } = credential

    const signedCred = new SignedCredential()
    signedCred.context = context
    signedCred.id = id
    signedCred.type = type
    signedCred.credentialSubject = credentialSubject
    signedCred.issued = new Date()
    signedCred.expires = expires || new Date(Date.now() + DEFAULT_EXPIRY_MS)
    signedCred.issuer = issInfo.issuerDid

    if (signedCred.expires <= signedCred.issued) {
      throw new Error(ErrorCodes.VCInvalidExpiryDate)
    }

    return signedCred
  }

  /**
   * Instantiates a {@link SignedCredential} from it's JSON form
   * @param json - Verifiable Credential in JSON-LD form
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  public static fromJSON(json: SignedCredentialJSON): SignedCredential {
    return plainToClass(SignedCredential, json)
  }

  /**
   * Serializes the {@link SignedCredential} as JSON-LD
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  //@ts-ignore
  public toJSON(): SignedCredentialJSON {
    return classToPlain(this, {exposeUnsetFields: false}) as SignedCredentialJSON
  }
}