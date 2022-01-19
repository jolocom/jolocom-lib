import 'reflect-metadata'
import {
  plainToClass,
  classToPlain,
  Exclude,
  Expose,
  Transform,
} from 'class-transformer'
import { canonize } from 'jsonld'
import {
  ILinkedDataSignature,
  ILinkedDataSignatureAttrs,
  IDigestable,
  ProofDerivationOptions
} from '../types'
import { sha256 } from '../../utils/crypto'
import { defaultContext } from '../../utils/contexts'
import { keyIdToDid } from '../../utils/helper'
import { IdentityWallet } from '../../identityWallet/identityWallet'
import { normalizeJsonLd } from '../../linkedData'
import { SupportedSuites } from '..'

@Exclude()
export class ChainedProof2021
  implements ILinkedDataSignature, IDigestable {
  static _type = "ChainedProof2021"
  private _verificationMethod = ''
  private _created: Date = new Date()
  private _signatureValue = ''
  private _previousProof: ILinkedDataSignature
  private _proofPurpose = 'assertionMethod'
  private _chainSignatureSuite: SupportedSuites = SupportedSuites.EcdsaKoblitzSignature2016

  @Expose()
  get chainSignatureSuite() {
    return this._chainSignatureSuite
  }

  set chainSignatureSuite(chainSignatureSuite) {
    this._chainSignatureSuite = chainSignatureSuite
  }

  @Expose()
  get proofPurpose() {
    return this._proofPurpose
  }

  set proofPurpose(proofPurpose: string) {
    this._proofPurpose = proofPurpose
  }

  /**
   * Get the creation date of the linked data signature
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

  /**
   * Set the creation date of the linked data signature
   * @example `proof.created = Date 2018-11-11T15:46:09.720Z`
   */

  set created(created: Date) {
    this._created = created
  }

  /**
   * Get the type of the linked data signature
   * @example `console.log(proof.type) // 'EcdsaKoblitzSignature2016'`
   */

  @Expose()
  get type() {
    return ChainedProof2021._type
  }

  /**
   * Set the type of the linked data signature
   * @example `proof.type = 'EcdsaKoblitzSignature2016'`
   */

  set type(type: string) {
  }

  set nonce(nonce: string) {
  }

  @Expose()
  @Transform((value: ILinkedDataSignature) => {
    return {
      created: value.created,
      //@ts-ignore, verificationMethod needs to be defined on the interface
      verificationMethod: value.verificationMethod,
      type: value.type,
      proofPurpose: 'assertionMethod'
    }
  })
  get previousProof() {
    return this._previousProof
  }

  set previousProof(prevProof: ILinkedDataSignature) {
    this._previousProof = prevProof
  }

  /**
   * Get the hex encoded signature value
   * @example `console.log(proof.signature) // '2b8504698e...'`
   */

  @Expose({ name: 'signatureValue' })
  get signature() {
    return this._signatureValue
  }

  /**
   * Set the hex encoded signature value
   * @example `proof.signature = '2b8504698e...'`
   */

  set signature(signature: string) {
    this._signatureValue = signature
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
   * Set the identifier of the public signing key
   * @example `proof.verificationMethod = 'did:jolo:...#keys-1`
   */

  set creator(creator: string) {
  }

  get signer() {
    return {
      did: keyIdToDid(this.verificationMethod),
      keyId: this.verificationMethod,
    }
  }

  static fromPreviousProof(prevProof: ILinkedDataSignature, algs: { digest: Function, sign: Function, normalize: Function } = {
    digest: sha256,
    sign: () => { },
    normalize: normalizeJsonLd
  }): ChainedProof2021 {
    const cp = new ChainedProof2021()
    cp.previousProof = prevProof
    return cp
  }

  async derive(inputs: ProofDerivationOptions, signer: IdentityWallet, pass: string) {
    if (!inputs.previousProofs || inputs.previousProofs.length === 0) {
      throw new Error('ChainedProof requires existing proofs')
    }

    let ldSign = new ChainedProof2021()

    // TODO pass index as a proof option
    ldSign.previousProof = inputs.previousProofs[0]
    ldSign.verificationMethod = inputs.proofOptions.verificationMethod
    ldSign.created = inputs.proofOptions.created

    const { context, ...document } = inputs.document
    const normalizedDoc = await normalizeJsonLd(document, inputs.document['@context'])
    const normalizedPrevProof = await normalizeJsonLd(ldSign.previousProof.toJSON(), inputs.document['@context'])

    const {signatureValue, ...proofOptions} = ldSign.toJSON()
    const normalizedProofOptions = await normalizeJsonLd(proofOptions, inputs.document['@context'])

    console.log('Normalized "previousProof" node:')
    console.log(normalizedPrevProof)

    console.log('Normalized "ChainedProof2021" proofOptions:')
    console.log(normalizedProofOptions)

    const toSign = Buffer.concat([
      sha256(Buffer.from(normalizedDoc)),
      sha256(Buffer.from(normalizedPrevProof))
    ])

    ldSign.signature = await (await signer.sign(toSign, pass)).toString('hex')

    return ldSign
  }

  /**
   * Converts the lined data signature to canonical form
   * @see {@link https://w3c-dvcg.github.io/ld-signatures/#dfn-canonicalization-algorithm | Canonicalization algorithm }
   */

  private async normalize(): Promise<string> {
    const json: ILinkedDataSignatureAttrs = this.toJSON()

    json['@context'] = defaultContext

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
    json: ILinkedDataSignatureAttrs,
  ): ChainedProof2021 {
    return plainToClass(ChainedProof2021, json)
  }

  /**
   * Serializes the {@link EcdsaLinkedDataSignature} as JSON-LD
   */

  public toJSON(): ILinkedDataSignatureAttrs {
    return classToPlain(this) as ILinkedDataSignatureAttrs
  }
}
