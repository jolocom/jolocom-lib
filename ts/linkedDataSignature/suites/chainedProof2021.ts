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
import { dateToIsoString } from '../../credentials/v1.1/util'

export enum ErrorCodes {
  InnerSignatureVerificationFailed = 'InnerSignatureVerificationFailed',
  ChainAndInnerSignatureVerificationFailed = 'ChainAndInnerSignatureVerificationFailed',
}

type customProofOptions = {
  chainSignatureSuite: SupportedSuites
  previousProof: PreviousProofOptions
  strict?: boolean
}

export type PreviousProofOptions = {
  type: SupportedSuites
  verificationMethod: string
  created: Date
  proofPurpose: string
  domain?: string
}

/**
 * @class Proof of concept implementation for a new Linked Data Proof type -- ChainedProof2021.
 * For provisional specifcation, see {@see https://hackmd.io/@RYgJMHAGSlaLMaQzwYjvsQ/SJoDWwTdK}
 */

@Exclude()
export class ChainedProof2021<
  T extends BaseProofOptions
> extends LinkedDataProof<T> {
  proofType = SupportedSuites.ChainedProof2021
  proofPurpose = 'assertionMethod'
  signatureSuite = {
    hashFn: undefined,
    normalizeFn: undefined,
    encodeSignature: undefined,
    decodeSignature: undefined,
  }

  private _previousProof: PreviousProofOptions
  private _chainSignatureSuite: SupportedSuites =
    SupportedSuites.EcdsaKoblitzSignature2016

  @Expose()
  get chainSignatureSuite() {
    return this._chainSignatureSuite
  }

  set chainSignatureSuite(chainSignatureSuite) {
    this._chainSignatureSuite = chainSignatureSuite
    if (
      !this.signatureSuite.normalizeFn &&
      !this.signatureSuite.hashFn &&
      !this.signatureSuite.encodeSignature &&
      !this.signatureSuite.decodeSignature
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
   * Get / set the type of the linked data signature
   * @example `console.log(proof.type) // 'ChainedProof2021'`
   */

  @Expose()
  get type() {
    return this.proofType
  }

  set type(type: SupportedSuites) {
    this.proofType = type
  }

  /**
   * Get / set the previous proof node
   */

  get previousProof() {
    return this._previousProof
  }

  set previousProof(prevProof: PreviousProofOptions) {
    this._previousProof = prevProof
  }

  /**
   * Get / set the previous proof purpose
   */

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

  /**
   * Static method to instantiate a (minimally configured) LD Proof instance
   * @param args - metadata related to the proof {@link BaseProofOptions}
   * @returns - new instance of a {@link ChainedProof2021}
   */
  static create<T extends BaseProofOptions>(args: T): LinkedDataProof<T> {
    const cp = new ChainedProof2021()

    cp.verificationMethod = args.verificationMethod
    cp.created = args.created || new Date()
    cp._proofPurpose = args.proofPurpose || 'assertionMethod'

    return cp
  }

  /**
   * Will derive a new instance of a ChainedProof2021, populate all relevant fields and
   * generate the associated signature.
   * @param inputs - The document to be signed, including existing proof nodes
   * @param customProofOptions  - A reference to the previousProof node, the suite to use with the chained proof
   * @param signer - Insance of IdentityWalle which can be used to generate a signature
   * @param pass - Password for using the keys managed by the IdentityWallet
   * @returns - new instance of a {@link ChainedProof2021}
   */
  async derive(
    inputs: ProofDerivationOptions,
    customProofOptions: customProofOptions,
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

    const toBeSigned = await this.createVerifyHash(classToPlain(ldProof))

    this.signature = this.signatureSuite.encodeSignature(
      await signer.sign(toBeSigned, pass)
    )

    return this
  }

  /**
   * Will attempt to verify the signature included in the LD Proof instnace.
   * @param inputs - The document to be verified, including existing proof nodes.
   * @param signer - An {@link Identity} instance expected to hold the appropriate public keys.
   * to verify the signature (i.e. must hold the required verificationMethod).
   * @returns {Promise<boolean>} - boolean signalling if the signature is correct or not.
   */
  async verify(inputs: ProofDerivationOptions, signer: Identity) {
    const previousProof = this.findMatchingProof(inputs.previousProofs)

    if (!previousProof) {
      throw new Error('Referenced Previous Proof not found')
    }

    const toBeVerified = await this.createVerifyHash(
      classToPlain(previousProof)
    )

    const referencedProofValid = await previousProof
      .verify(inputs, signer)
      .catch((e) =>
        e.message && e.message === ErrorCodes.InnerSignatureVerificationFailed
          ? true
          : false
      )

    const chainSignatureValid = await verifySignatureWithIdentity(
      toBeVerified,
      this.signatureSuite.decodeSignature(this.signature),
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

  /**
   * Will normalize the contents of the signed document, hash them, then normalize the
   * current "Proof Options" and hash them. Generates the inputs for the signature generation / verification functions.
   * Generally covers this process {@see https://w3c-ccg.github.io/data-integrity-spec/#create-verify-hash-algorithm}
   * @returns Buffer to be signed / verified.
   */
  private async createVerifyHash(document: JsonLdObject) {
    // The entire previousProof node normalized, all properties (e.g. jws, signatureValue) are included.
    const normalizedPrevProof = await this.signatureSuite.normalizeFn({
      ...document,
      '@context': document['@context'],
    })

    const { proofValue, ...proofOptions } = this.toJSON()

    // Normalized Chained Data Proof options
    const normalizedProofOptions = await this.signatureSuite.normalizeFn({
      ...proofOptions,
      '@context': document['@context'],
    })

    return Buffer.concat([
      this.signatureSuite.hashFn(Buffer.from(normalizedProofOptions)),
      this.signatureSuite.hashFn(Buffer.from(normalizedPrevProof)),
    ])
  }

  /**
   * Helper function to find a matching LD proof node based on the `previousProof`
   * options included in a chained proof.
   * @param proofs - existing {@link LinkedDataProof} nodes associated with the doc
   * @returns matching {@link LinkedDataProof}, if found
   */
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
        `Expected previousProof to match exactly one proof node, instead it matches ${matches.length}`
      )
    }

    return matches[0]
  }

  /**
   * Parses / Serializes the {@link EcdsaLinkedDataSignature} as / to JSON-LD
   */

  public static fromJSON(
    json: ILinkedDataSignatureAttrs
  ): ChainedProof2021<BaseProofOptions> {
    return plainToClass(ChainedProof2021, json)
  }

  public toJSON(): ILinkedDataSignatureAttrs {
    return classToPlain(this) as ILinkedDataSignatureAttrs
  }
}
