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
    digestAlg: sha256,
    normalizationFn: async (doc: JsonLdObject) => {
      return await normalizeJsonLd(doc, defaultContext)
    },
    signatureEncodingFn: (data: Buffer) => data.toString('hex'),
    signatureDecodingFn: (data: string) => Buffer.from(data, 'hex'),
  }

  static create(arg: BaseProofOptions) {
    const cp = new EcdsaLinkedDataSignature()
    cp.verificationMethod = arg.verificationMethod
    cp.created = arg.created || new Date()
    cp._proofPurpose = arg.proofPurpose || 'assertionMethod'

    return cp as LinkedDataProof<BaseProofOptions>
  }

  /**
   * Get / set the expiry date for the linked data signature
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
   * Set the identifier of the public signing key
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

    const toSign = await this.generateHashAlg(inputs.document)
    const signature = await signer.sign(toSign, pass)
    this.signatureValue = this.signatureSuite.signatureEncodingFn(signature)

    return this
  }

  private async generateHashAlg(document: JsonLdObject) {
    // Normalized Document
    const normalizedDoc = await this.signatureSuite.normalizationFn(document)

    // console.log({normalizedDoc, document, context: document['@context']})
    const { signatureValue, ...proofOptions } = this.toJSON()

    const normalizedProofOptions = await this.signatureSuite.normalizationFn(
      proofOptions
    )

    return Buffer.concat([
      this.signatureSuite.digestAlg(Buffer.from(normalizedProofOptions)),
      this.signatureSuite.digestAlg(Buffer.from(normalizedDoc)),
    ])
  }

  async verify(inputs: ProofDerivationOptions, signer: Identity) {
    const digest = await this.generateHashAlg(inputs.document)

    return verifySignatureWithIdentity(
      digest,
      this.signatureSuite.signatureDecodingFn(this.signatureValue),
      this.verificationMethod,
      signer
    )
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
