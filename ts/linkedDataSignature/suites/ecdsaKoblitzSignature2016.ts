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
} from '../types'
import { sha256 } from '../../utils/crypto'
import { defaultContext } from '../../utils/contexts'
import { keyIdToDid } from '../../utils/helper'
import { IdentityWallet } from '../../identityWallet/identityWallet'
import { LinkedDataProof } from 'did-resolver'
import { normalizeJsonLd } from '../../linkedData'
import { JsonLdObject } from '@jolocom/protocol-ts'

/**
 * @class A EcdsaKoblitz linked data signature implementation
 * @implements {ILinkedDataSignature}
 * @implements {IDigestable}
 * @internal
 */

@Exclude()
export class EcdsaLinkedDataSignature
  implements ILinkedDataSignature, IDigestable {
  static _type = "EcdsaKoblitzSignature2016"
  private _verificationMethod = ''
  private _created: Date = new Date()
  private _proofValue = ''
  private _proofPurpose = 'assertionMethod'

  // TODO Delete
  set nonce(nonce: string) {}

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
    return EcdsaLinkedDataSignature._type
  }

  /**
   * Get the hex encoded signature value
   * @example `console.log(proof.signature) // '2b8504698e...'`
   */

  @Expose({ name: 'signatureValue' })
  get signatureValue() {
    return this._proofValue
  }

  /**
   * Set the hex encoded signature value
   * @example `proof.signature = '2b8504698e...'`
   */

  set signature(signature: string) {
    this._proofValue = signature
  }

  /**
   * Set the identifier of the public signing key
   * @example `proof.creator = 'did:jolo:...#keys-1`
   */

  set creator(creator: string) {
    this._verificationMethod = creator
  }

  @Expose()
  get verificationMethod() {
    return this._verificationMethod
  }

  set verificationMethod(verificationMethod: string) {
    this._verificationMethod = verificationMethod
  }

  get signer() {
    return {
      did: keyIdToDid(this.verificationMethod),
      keyId: this.verificationMethod,
    }
  }

  async derive(inputs: DerivationOptions, signer: IdentityWallet, pass: string) {
    const ldSig = new EcdsaLinkedDataSignature()

    ldSig.verificationMethod = inputs.proofOptions.verificationMethod
    ldSig.created = inputs.proofOptions.created

    const { context, ...document } = inputs.document

    const normalizedDoc = await normalizeJsonLd(document, inputs.document['@context'])

    const {signatureValue, ...proofOptions} = ldSig.toJSON()
    const normalizedProofOptions = await normalizeJsonLd(proofOptions, inputs.document['@context'])

    const toSign = Buffer.concat([
      sha256(Buffer.from(normalizedProofOptions)),
      sha256(Buffer.from(normalizedDoc))
    ])

    ldSig.signature = await (await signer.sign(toSign, pass)).toString('hex')

    return ldSig
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
  ): EcdsaLinkedDataSignature {
    return plainToClass(EcdsaLinkedDataSignature, json)
  }

  /**
   * Serializes the {@link EcdsaLinkedDataSignature} as JSON-LD
   */

  public toJSON(): ILinkedDataSignatureAttrs {
    return classToPlain(this) as ILinkedDataSignatureAttrs
  }
}


type DerivationOptions = {
  document: JsonLdObject,
  previousProofs?: LinkedDataProof[],
  proofOptions: {
    verificationMethod: string,
    created: Date
  }
}