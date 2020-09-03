import 'reflect-metadata'
import {
  plainToClass,
  classToPlain,
  Expose,
  Transform,
  Exclude,
} from 'class-transformer'
import { canonize } from 'jsonld'
import { LinkedDataSignatureSuite, ILinkedDataSignatureAttrs } from './types'

import { defaultContext } from '../utils/contexts'
import { keyIdToDid } from '../utils/helper'
import {
  isoStringToDate,
  dateToISOString,
  withDefaultValue,
} from '../utils/classTransformerUtils'

@Exclude()
export class LinkedDataSignature {
  private _type: LinkedDataSignatureSuite
  private _creator: string
  private _created: Date
  private _nonce: string
  private _signatureValue: string

  /**
   * Get the creation date of the linked data signature
   * @example `console.log(proof.created) // Date 2018-11-11T15:46:09.720Z`
   * @TODO Check if the transformer is needed
   */

  @Expose()
  @Transform(isoStringToDate, { toClassOnly: true })
  @Transform(dateToISOString, { toPlainOnly: true })
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
   * @example `console.log(proof.type) // 'EcdsaSecp256k1Signature2019'`
   */

  @Expose()
  @Transform(withDefaultValue(''), { toPlainOnly: true })
  get type() {
    return this._type
  }

  /**
   * Set the type of the linked data signature
   * @example `proof.type = 'EcdsaSecp256k1Signature2019'`
   */

  set type(type: LinkedDataSignatureSuite) {
    this._type = type
  }

  /**
   * Get the random signature nonce
   * @example `console.log(proof.nonce) // 'abc...fe'`
   */

  @Expose()
  @Transform(withDefaultValue(''), { toPlainOnly: true })
  get nonce() {
    return this._nonce
  }

  /**
   * Set the random signature nonce
   * @example `proof.nonce = 'abc...fe'`
   */

  set nonce(nonce: string) {
    this._nonce = nonce
  }

  /**
   * Get the hex encoded signature value
   * @example `console.log(proof.signature) // '2b8504698e...'`
   */

  @Expose({ name: 'signatureValue' })
  @Transform(withDefaultValue(''), { toPlainOnly: true })
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
   * @example `console.log(proof.creator) // 'did:jolo:...#keys-1`
   */

  @Expose()
  @Transform(withDefaultValue(''), { toPlainOnly: true })
  get creator(): string {
    return this._creator
  }

  /**
   * Set the identifier of the public signing key
   * @example `proof.creator = 'did:jolo:...#keys-1`
   */

  set creator(creator: string) {
    this._creator = creator
  }

  get signer() {
    return {
      did: keyIdToDid(this.creator),
      keyId: this.creator,
    }
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

  public static fromJSON(json: ILinkedDataSignatureAttrs): LinkedDataSignature {
    return plainToClass(this, json)
  }

  public toJSON(): ILinkedDataSignatureAttrs {
    return classToPlain(this) as ILinkedDataSignatureAttrs
  }
}
