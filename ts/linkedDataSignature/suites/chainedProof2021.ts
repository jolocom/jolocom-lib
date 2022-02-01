import 'reflect-metadata'
import {
  plainToClass,
  classToPlain,
  Exclude,
  Expose,
  Transform,
} from 'class-transformer'
import { ILinkedDataSignatureAttrs, ProofDerivationOptions } from '../types'
import { parseHexOrBase64 } from '../../utils/helper'
import { IdentityWallet } from '../../identityWallet/identityWallet'
import { LinkedDataProof, SupportedSuites, BaseProofOptions } from '..'
import { Identity } from '../../identity/identity'
import { SuiteImplementation } from '../mapping'
import { JsonLdObject } from '../../linkedData/types'
import { verifySignatureWithIdentity } from '../../utils/validation'

export enum ErrorCodes {
  InnerSignatureVerificationFailed = 'InnerSignatureVerificationFailed',
  ChainAndInnerSignatureVerificationFailed = 'ChainAndInnerSignatureVerificationFailed',
}

@Exclude()
export class ChainedProof2021<
  T extends BaseProofOptions,
  P extends BaseProofOptions = BaseProofOptions
> extends LinkedDataProof<T> {
  proofType = SupportedSuites.ChainedProof2021
  private _previousProof: LinkedDataProof<P>
  private _chainSignatureSuite: SupportedSuites =
    SupportedSuites.EcdsaKoblitzSignature2016

  signatureSuite = {
    digestAlg: undefined,
    normalizationFn: undefined,
  }

  @Expose()
  get chainSignatureSuite() {
    return this._chainSignatureSuite
  }

  set chainSignatureSuite(chainSignatureSuite) {
    this._chainSignatureSuite = chainSignatureSuite
  }

  /**
   * Get / set the creation date of the linked data signature
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

  @Expose()
  @Transform((value: LinkedDataProof<P>) => {
    return {
      created: value.created,
      verificationMethod: value.verificationMethod,
      type: value.proofType,
      proofPurpose: 'assertionMethod',
    }
  })
  get previousProof() {
    return this._previousProof
  }

  set previousProof(prevProof: LinkedDataProof<P>) {
    this._previousProof = prevProof
  }

  /**
   * Get / set the proof / signature value associated with this node
   * @example `console.log(proof.signature) // '2b8504698e...'`
   */

  @Expose({ name: 'signatureValue' })
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
    cp.proofPurpose = args.proofPurpose || 'assertionMethod'

    return cp
  }

  async derive(
    inputs: ProofDerivationOptions,
    customProofOptions: CustomOptions,
    signer: IdentityWallet,
    pass: string
  ) {
    const { previousProofs } = inputs
    const { previousProof } = customProofOptions

    if (!previousProofs || previousProofs.length === 0) {
      throw new Error('ChainedProof requires existing proofs')
    }

    if (!previousProof || previousProofs.indexOf(previousProof) === -1) {
      throw new Error('Could not find referenced previous proof')
    }

    if (customProofOptions.strict) {
      const prevSigValid = await this.previousProof
        .verify(inputs, signer.identity)
        .catch((_) => false)

      if (!prevSigValid) {
        throw new Error(ErrorCodes.InnerSignatureVerificationFailed)
      }
    }

    this.previousProof = previousProof

    const chainSignatureSuite =
      SuiteImplementation[customProofOptions.chainSignatureSuite].impl

    if (!chainSignatureSuite) {
      throw new Error(
        `Signature suite ${customProofOptions.chainSignatureSuite} is not supported.`
      )
    }

    this.signatureSuite = new chainSignatureSuite().signatureSuite
    this.previousProof = customProofOptions.previousProof

    const toBeSigned = await this.generateHashAlg(inputs.document)
    this.signature = (await signer.sign(toBeSigned, pass)).toString('hex')

    return this
  }

  async verify(inputs: ProofDerivationOptions, signer: Identity) {
    const toBeVerified = await this.generateHashAlg(inputs.document)

    const referencedProofValid = await this.previousProof
      .verify(inputs, signer)
      .catch((_) => false)

    const chainSignatureValid = await verifySignatureWithIdentity(
      toBeVerified,
      parseHexOrBase64(this.signature),
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
    // Normalized Previous Proof Node
    const normalizedPrevProof = await this.signatureSuite.normalizationFn({
      ...classToPlain(this.previousProof),
      '@context': document['@context'],
    })

    const { signatureValue, ...proofOptions } = this.toJSON()

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
  previousProof: LinkedDataProof<BaseProofOptions>
  strict?: boolean
}
