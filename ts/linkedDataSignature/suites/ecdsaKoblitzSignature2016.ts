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
import { keyIdToDid, parseHexOrBase64 } from '../../utils/helper'
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

  signatureSuite = {
    digestAlg: sha256,
    normalizationFn: async (doc: JsonLdObject) => {
      return await normalizeJsonLd(doc, defaultContext)
    },
  }

  static create(arg: BaseProofOptions) {
    const cp = new EcdsaLinkedDataSignature()
    cp.verificationMethod = arg.verificationMethod
    cp.created = arg.created || new Date()
    cp.proofPurpose = arg.proofPurpose || 'assertionMethod'

    return cp as LinkedDataProof<BaseProofOptions>
  }

  /**
   * Get / set the expiry date for the linked data signature
   * @example `console.log(proof.created) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose()
  @Transform((value: string) => value && new Date(value), { toClassOnly: true })
  @Transform((value: Date) => value && value.toISOString(), {
    toPlainOnly: true,
  })
  get created() {
    return this._created
  }

  set created(created: Date) {
    this._created = created
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

  @Expose({ name: 'signatureValue' })
  get signatureValue() {
    return this._proofValue
  }

  set signature(signature: string) {
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

  set creator(creator: string) {
    this._verificationMethod = creator
  }

  get signer() {
    return {
      did: keyIdToDid(this.verificationMethod),
      keyId: this.verificationMethod,
    }
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
    this.signature = signature.toString('hex')

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
      parseHexOrBase64(this.signatureValue),
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
