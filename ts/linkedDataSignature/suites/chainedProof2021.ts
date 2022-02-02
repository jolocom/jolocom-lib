import 'reflect-metadata'
import {
  plainToClass,
  classToPlain,
  Exclude,
  Expose,
  Transform,
} from 'class-transformer'
import { ILinkedDataSignatureAttrs, ProofDerivationOptions } from '../types'
import { IdentityWallet } from '../../identityWallet/identityWallet'
import { LinkedDataProof, SupportedSuites, BaseProofOptions } from '..'
import { Identity } from '../../identity/identity'
import { SuiteImplementation } from '../mapping'
import { JsonLdObject } from '../../linkedData/types'
import { verifySignatureWithIdentity } from '../../utils/validation'
import { dateToIsoString } from '../../credentials/v1.1/signedCredential'

export enum ErrorCodes {
  InnerSignatureVerificationFailed = 'InnerSignatureVerificationFailed',
  ChainAndInnerSignatureVerificationFailed = 'ChainAndInnerSignatureVerificationFailed',
}

export type PreviousProofOptions = {
  type: SupportedSuites
  verificationMethod: string
  created: Date
  proofPurpose: string
  domain?: string
}

@Exclude()
export class ChainedProof2021<
  T extends BaseProofOptions
> extends LinkedDataProof<T> {
  proofType = SupportedSuites.ChainedProof2021
  proofPurpose = 'assertionMethod'
  private _previousProof: PreviousProofOptions
  private _chainSignatureSuite: SupportedSuites =
    SupportedSuites.EcdsaKoblitzSignature2016

  signatureSuite = {
    digestAlg: undefined,
    normalizationFn: undefined,
    signatureEncodingFn: undefined,
    signatureDecodingFn: undefined,
  }

  @Expose()
  get chainSignatureSuite() {
    return this._chainSignatureSuite
  }

  set chainSignatureSuite(chainSignatureSuite) {
    this._chainSignatureSuite = chainSignatureSuite
    if (
      !this.signatureSuite.normalizationFn &&
      !this.signatureSuite.digestAlg &&
      !this.signatureSuite.signatureEncodingFn &&
      !this.signatureSuite.signatureDecodingFn
    ) {
      //@ts-ignore typescript limitation, even if constructor is defined on all
      // union type members, it can not be called.
      this.signatureSuite = new SuiteImplementation[
        chainSignatureSuite
      ].impl().signatureSuite
    }
  }

  /**
   * Get / set the creation date of the linked data signature
   * @example `console.log(proof.created) // Date 2018-11-11T15:46:09.720Z`
   */

  @Expose()
  @Transform(({ value }) => value && new Date(value), { toClassOnly: true })
  @Transform(({ value }) => dateToIsoString(value), {
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

  set type(type: SupportedSuites) {
    this.proofType = type
  }

  @Expose()
  @Transform(
    ({ value }) => {
      return {
        created: value.created,
        verificationMethod: value.verificationMethod,
        type: value.type,
        proofPurpose: value.proofPurpose,
      }
    },
    { toPlainOnly: true }
  )
  get previousProof() {
    return this._previousProof
  }

  set previousProof(prevProof: PreviousProofOptions) {
    this._previousProof = prevProof
  }

  @Expose()
  get proofPurose() {
    return this._proofPurpose
  }

  set proofPurose(proofPurpose: string) {
    this._proofPurpose = proofPurpose
  }

  /**
   * Get / set the proof / signature value associated with this node
   * @example `console.log(proof.signature) // '2b8504698e...'`
   */

  @Expose({ name: 'proofValue' })
  get signature() {
    return this._proofValue
  }

  set signature(signature: string) {
    this._proofValue = signature
  }

  /**
   * Get the identifier of the public signing key
   * @example `console.log(proof.verificationMethod) // 'did:jolo:...#keys-1`
   */

  @Expose()
  get verificationMethod() {
    return this._verificationMethod
  }

  set verificationMethod(verificationMethod: string) {
    this._verificationMethod = verificationMethod
  }

  static create<T extends BaseProofOptions>(args: T): LinkedDataProof<T> {
    const cp = new ChainedProof2021()

    cp.verificationMethod = args.verificationMethod
    cp.created = args.created || new Date()
    cp._proofPurpose = args.proofPurpose || 'assertionMethod'

    return cp
  }

  async derive(
    inputs: ProofDerivationOptions,
    customProofOptions: CustomOptions,
    signer: IdentityWallet,
    pass: string
  ) {
    this.previousProof = customProofOptions.previousProof

    const ldProof = this.findMatchingProof(inputs.previousProofs)

    if (customProofOptions.strict) {
      const prevSigValid = await ldProof
        .verify(inputs, signer.identity)
        .catch((_) => false)

      if (!prevSigValid) {
        throw new Error(ErrorCodes.InnerSignatureVerificationFailed)
      }
    }

    this.chainSignatureSuite = customProofOptions.chainSignatureSuite

    const toBeSigned = await this.generateHashAlg(classToPlain(ldProof))
    this.signature = this.signatureSuite.signatureEncodingFn(
      await signer.sign(toBeSigned, pass)
    )

    return this
  }

  private findMatchingProof(proofs: LinkedDataProof<BaseProofOptions>[]) {
    const matches = proofs.filter(
      ({ proofPurpose, proofType, created, verificationMethod }) => {
        return (
          proofType === this.previousProof.type &&
          verificationMethod === this.previousProof.verificationMethod &&
          created.toString() === this.previousProof.created.toString() &&
          proofPurpose === this.previousProof.proofPurpose
        )
      }
    )

    if (matches.length !== 1) {
      throw new Error(
        `Expected previousProof to match exactly one proof node, instead it matches - ${matches.length}`
      )
    }

    return matches[0]
  }

  async verify(inputs: ProofDerivationOptions, signer: Identity) {
    const previousProof = this.findMatchingProof(inputs.previousProofs)

    if (!previousProof) {
      throw new Error('Referenced Previous Proof not found')
    }

    const toBeVerified = await this.generateHashAlg(classToPlain(previousProof))

    const referencedProofValid = await previousProof
      .verify(inputs, signer)
      .catch((e) =>
        e.message && e.message === ErrorCodes.InnerSignatureVerificationFailed
          ? true
          : false
      )

    const chainSignatureValid = await verifySignatureWithIdentity(
      toBeVerified,
      this.signatureSuite.signatureDecodingFn(this.signature),
      this.verificationMethod,
      signer
    ).catch((_) => false)

    if (!referencedProofValid && !chainSignatureValid) {
      throw new Error(ErrorCodes.ChainAndInnerSignatureVerificationFailed)
    }

    if (!referencedProofValid) {
      throw new Error(ErrorCodes.InnerSignatureVerificationFailed)
    }

    return chainSignatureValid
  }

  private async generateHashAlg(document: JsonLdObject) {
    // The entire previousProof node normalized, all properties (e.g. jws, signatureValue) are included.
    const normalizedPrevProof = await this.signatureSuite.normalizationFn({
      ...document,
      '@context': document['@context'],
    })

    const { proofValue, ...proofOptions } = this.toJSON()

    // Normalized Chained Data Proof options
    const normalizedProofOptions = await this.signatureSuite.normalizationFn({
      ...proofOptions,
      '@context': document['@context'],
    })

    return Buffer.concat([
      this.signatureSuite.digestAlg(Buffer.from(normalizedPrevProof)),
      this.signatureSuite.digestAlg(Buffer.from(normalizedProofOptions)),
    ])
  }

  public static fromJSON(
    json: ILinkedDataSignatureAttrs
  ): ChainedProof2021<BaseProofOptions> {
    return plainToClass(ChainedProof2021, json)
  }

  /**
   * Serializes the {@link EcdsaLinkedDataSignature} as JSON-LD
   */

  public toJSON(): ILinkedDataSignatureAttrs {
    return classToPlain(this) as ILinkedDataSignatureAttrs
  }
}

type CustomOptions = {
  chainSignatureSuite: SupportedSuites
  previousProof: PreviousProofOptions
  strict?: boolean
}
