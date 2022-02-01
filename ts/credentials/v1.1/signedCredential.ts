import 'reflect-metadata'
import {
  classToPlain,
  Exclude,
  Expose,
  plainToClass,
  Transform,
} from 'class-transformer'
import { ISignedCredentialAttrs } from '../types'
import { ILinkedDataSignatureAttrs } from '../../linkedDataSignature/types'
import { LinkedDataProof, BaseProofOptions } from '../../linkedDataSignature'
import { Credential } from './credential'
import { randomBytes } from 'crypto'
import { BaseMetadata, ISignedCredCreationArgs } from '@jolocom/protocol-ts'
import { ErrorCodes } from '../../errors'
import { SuiteImplementation } from '../../linkedDataSignature/mapping'

// Credentials are valid for a year by default
const DEFAULT_EXPIRY_MS = 365 * 24 * 3600 * 1000

/**
 * @ignore
 * Helper function generating a random claim id
 * @param length - The length of the random part of the identifier
 */

const generateClaimId = (length: number) =>
  `claimId:${randomBytes(length).toString('hex')}`

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
export class SignedCredential extends Credential {
  private _issuer: string
  private _issued: Date
  private _expires?: Date
  private _proof: LinkedDataProof<BaseProofOptions>[] = []
  private _credentialSchema: { id: string; type: string }

  /**
   * Get the identifier of the signed credential
   * @example `console.log(signedCredential.id) //claimId:25453fa543da7`
   */

  @Expose()
  @Transform((value) => value || generateClaimId(8), { toClassOnly: true })
  get id(): string {
    return this._id
  }

  /**
   * Set the identifier of the signed credential
   * @example `signedCredential.id = 'claimId:2543fa543da7'`
   */

  set id(id: string) {
    this._id = id
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
   * Get the issuance date of the signed credential
   * @example `console.log(signedCredential.issued) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose({ name: 'issuanceDate' })
  @Transform((value: Date) => value && value.toISOString(), {
    toPlainOnly: true,
  })
  @Transform((value: string) => value && new Date(value), { toClassOnly: true })
  get issued(): Date {
    return this._issued
  }

  /**
   * Set the issuance date of the signed credential
   * @example `signedCredential.issued = new Date('2018-11-11T15:46:09.720Z')`
   */

  set issued(issued: Date) {
    this._issued = issued
  }

  /**
   * Get the type of the signed credential
   * @example `console.log(signedCredential.type) // ['Credential', 'ProofOf...Credential']`
   */

  @Expose()
  get type(): string[] {
    return this._type
  }

  /**
   * Set the type of the credential
   * @example `signedCredential.type = ['Credential', 'ProofOf...Credential']`
   */

  set type(type: string[]) {
    this._type = type
  }

  @Expose()
  get credentialSchema() {
    return this._credentialSchema
  }

  set credentialSchema(schema: { id: string; type: string }) {
    this._credentialSchema = schema
  }

  /**
   * Get the expiry date of the signed credential
   * @example `console.log(signedCredential.expires) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose({ name: 'expirationDate' })
  @Transform((value: Date) => value && value.toISOString(), {
    toPlainOnly: true,
  })
  @Transform((value: string) => value && new Date(value), { toClassOnly: true })
  get expires(): Date {
    return this._expires
  }

  /**
   * Set the expiry date of the signed credential
   * @example `signedCredential.expires = new Date('2019-11-11T15:46:09.720Z')`
   */

  set expires(expiry: Date) {
    this._expires = expiry
  }

  @Expose()
  @Transform((value) => value.filter((v) => !!v).map((v) => v.toJSON()), {
    toPlainOnly: true,
  })
  @Transform(
    (value: ILinkedDataSignatureAttrs[]) => {
      const proofs = Array.isArray(value) ? value : [value]

      return proofs.map((v) => {
        const dto = SuiteImplementation[v.type]

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
    expires = new Date(Date.now() + DEFAULT_EXPIRY_MS)
  ) {
    const credential = Credential.build(credentialOptions)
    const json = (credential.toJSON() as unknown) as ISignedCredentialAttrs
    const signedCredential = SignedCredential.fromJSON(json)

    signedCredential.expires = expires
    signedCredential.issued = new Date()

    if (signedCredential.expires <= signedCredential.issued) {
      throw new Error(ErrorCodes.VCInvalidExpiryDate)
    }

    signedCredential.issuer = issInfo.issuerDid

    return signedCredential
  }

  /**
   * Instantiates a {@link SignedCredential} from it's JSON form
   * @param json - Verifiable Credential in JSON-LD form
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  public static fromJSON(json: ISignedCredentialAttrs): SignedCredential {
    return plainToClass(SignedCredential, json)
  }

  /**
   * Serializes the {@link SignedCredential} as JSON-LD
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  public toJSON(): ISignedCredentialAttrs {
    return classToPlain(this) as ISignedCredentialAttrs
  }
}
