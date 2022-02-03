import 'reflect-metadata'
import {
  plainToClass,
  classToPlain,
  Exclude,
  Expose,
  Transform,
} from 'class-transformer'
import { canonize } from 'jsonld'
import { ILinkedDataSignatureAttrs, ProofDerivationOptions } from '../types'
import { sha256 } from '../../utils/crypto'
import { defaultContext } from '../../utils/contexts'
import { keyIdToDid} from '../../utils/helper'
import { IdentityWallet } from '../../identityWallet/identityWallet'
import { normalizeJsonLd } from '../../linkedData'
import { JsonLdObject } from '@jolocom/protocol-ts'
import { Identity } from '../../identity/identity'
import { verifySignatureWithIdentity } from '../../utils/validation'
import { LinkedDataProof, SupportedSuites, BaseProofOptions } from '..'

/**
 * @class A EcdsaKoblitz linked data signature implementation
 * @implements {ILinkedDataSignature}
 * @implements {IDigestable}
 * @internal
 */

@Exclude()
export class EcdsaLinkedDataSignature<
  T extends BaseProofOptions
> extends LinkedDataProof<T> {
  proofType = SupportedSuites.EcdsaKoblitzSignature2016
  proofPurpose = 'assertionMethod'

  signatureSuite = {
    hashFn: sha256,
    normalizeFn: async (doc: JsonLdObject) => {
      return await normalizeJsonLd(doc, defaultContext)
    },
    encodeSignature: (data: Buffer) => data.toString('hex'),
    decodeSignature: (data: string) => Buffer.from(data, 'hex'),
  }

  /**
   * Get / set the created / issuance date for the linked data signature
   * @example `console.log(proof.created) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose()
  @Transform(({ value }) => value && new Date(value), { toClassOnly: true })
  @Transform(({ value }) => value && value.toISOString(), {
    toPlainOnly: true,
  })
  get created() {
    return this._created
  }

  set created(created: Date) {
    this._created = created
  }
  
  /**
   * Get /set the proofPurpose field
   * @example `console.log(proof.proofPurpose) // 'assertionMethod'`
   */

  @Expose()
  get proofPurose() {
    return this._proofPurpose
  }

  set proofPurose(proofPurpose: string) {
    this._proofPurpose = proofPurpose
  }

  /**
   * Get the type of the linked data signature
   * @example `console.log(proof.type) // 'EcdsaKoblitzSignature2016'`
   */

  @Expose()
  get type() {
    return this.proofType
  }

  /**
   * Get / set the hex encoded signature value
   * @example `console.log(proof.signature) // '2b8504698e...'`
   */

  @Expose()
  get signatureValue() {
    return this._proofValue
  }

  set signatureValue(signature: string) {
    this._proofValue = signature
  }

  /**
   * Get / set the identifier of the public signing key
   * @example `proof.creator = 'did:jolo:...#keys-1`
   */

  @Expose()
  get verificationMethod() {
    return this._verificationMethod
  }

  set verificationMethod(verificationMethod: string) {
    this._verificationMethod = verificationMethod
  }

  // These getter / setter methods are needed for backwards compatibility, i.e. with the DIDDocument class
  set creator(creator: string) {
    this._verificationMethod = creator
  }

  get signer() {
    return {
      did: keyIdToDid(this.verificationMethod),
      keyId: this.verificationMethod,
    }
  }

  get signature() {
    return this._proofValue
  }

  set signature(signature: string) {
    this._proofValue = signature
  }

  get nonce() {
    return ""
  }

  /**
   * Static method to instantiate a (minimally configured) LD Proof instance
   * @param args - metadata related to the proof {@link BaseProofOptions}
   * @returns - new instance of a {@link EcdsaKoblitzSignature2016}
   */
  static create(arg: BaseProofOptions) {
    const cp = new EcdsaLinkedDataSignature()
    cp.verificationMethod = arg.verificationMethod
    cp.created = arg.created || new Date()
    cp._proofPurpose = arg.proofPurpose || 'assertionMethod'

    return cp as LinkedDataProof<BaseProofOptions>
  }

  /**
   * Will derive a new instance of a EcdsaKoblitzSignature2016 proof, populate all relevant fields and
   * generate the associated signature.
   * @param inputs - The document to be signed, including existing proof nodes
   * @param customProofOptions  - no custom options are expected / used for this proof type
   * @param signer - Insance of IdentityWalle which can be used to generate a signature
   * @param pass - Password for using the keys managed by the IdentityWallet
   * @returns - new instance of a {@link EcdsaKoblitzSignature2016}
   */
  async derive(
    inputs: ProofDerivationOptions,
    proofSpecificOptions: {},
    signer: IdentityWallet,
    pass: string
  ) {
    if (!this.verificationMethod || !this.created) {
      throw new Error('Proof options not set')
    }

    if (this.verificationMethod !== signer.publicKeyMetadata.signingKeyId) {
      throw new Error(
        `No signer for referenced verificationMethod ${this.verificationMethod}`
      )
    }

    const toSign = await this.createVerifyHash(inputs.document)
    const signature = await signer.sign(toSign, pass)
    this.signatureValue = this.signatureSuite.encodeSignature(signature)

    return this
  }

  /**
   * Will attempt to verify the signature included in the LD Proof instance.
   * @param inputs - The document to be verified, including existing proof nodes.
   * @param signer - An {@link Identity} instance expected to hold the appropriate public keys.
   * to verify the signature (i.e. must hold the required verificationMethod).
   * @returns {Promise<boolean>} - boolean signalling if the signature is correct or not.
   */
  async verify(inputs: ProofDerivationOptions, signer: Identity) {
    const digest = await this.createVerifyHash(inputs.document)

    return verifySignatureWithIdentity(
      digest,
      this.signatureSuite.decodeSignature(this.signatureValue),
      this.verificationMethod,
      signer
    )
  }

  /**
   * Will normalize the contents of the signed document, hash them, then normalize the
   * current "Proof Options" and hash them. Generates the inputs for the signature generation / verification functions.
   * Generally covers this process {@see https://w3c-ccg.github.io/data-integrity-spec/#create-verify-hash-algorithm}
   * @returns Buffer to be signed / verified.
   */
  private async createVerifyHash(document: JsonLdObject) {
    // Normalized Document
    const normalizedDoc = await this.signatureSuite.normalizeFn(document)

    const { signatureValue, ...proofOptions } = this.toJSON()

    const normalizedProofOptions = await this.signatureSuite.normalizeFn(
      proofOptions
    )

    return Buffer.concat([
      this.signatureSuite.hashFn(Buffer.from(normalizedProofOptions)),
      this.signatureSuite.hashFn(Buffer.from(normalizedDoc)),
    ])
  }

  /**
   * Converts the lined data signature to canonical form
   * @see {@link https://w3c-dvcg.github.io/ld-signatures/#dfn-canonicalization-algorithm | Canonicalization algorithm }
   */

  private async normalize(): Promise<string> {
    const json: ILinkedDataSignatureAttrs = this.toJSON()

    json['@context'] = defaultContext[0]

    delete json.signatureValue
    delete json.type
    delete json.id

    return canonize(json)
  }

  public async asBytes(): Promise<Buffer> {
    return Buffer.from(await this.normalize())
  }

  /**
   * Returns the sha256 hash of the linked data signature, per {@link https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm | specification}.
   */

  public async digest(): Promise<Buffer> {
    const normalized = await this.normalize()
    return sha256(Buffer.from(normalized))
  }

  /**
   * Instantiates a {@link EcdsaLinkedDataSignature} from it's JSON form
   * @param json - Linked data signature in JSON-LD form
   */

  public static fromJSON(
    json: ILinkedDataSignatureAttrs
  ): EcdsaLinkedDataSignature<BaseProofOptions> {
    return plainToClass(EcdsaLinkedDataSignature, json)
  }

  /**
   * Serializes the {@link EcdsaLinkedDataSignature} as JSON-LD
   */

  public toJSON(): ILinkedDataSignatureAttrs {
    return classToPlain(this) as ILinkedDataSignatureAttrs
  }
}
