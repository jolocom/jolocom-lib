import 'reflect-metadata'
import {
  plainToClass,
  classToPlain,
  Exclude,
  Expose,
  Transform,
} from 'class-transformer'
import {
  ILinkedDataSignature,
  ILinkedDataSignatureAttrs,
  IDigestible,
} from '../types'
import { sha256 } from '../../utils/crypto'
import { keyIdToDid } from '../../utils/helper'
import {
  normalizeJsonLD,
} from '../../validation/jsonLdValidator'
import {didDocumentContext, JsonLdContext} from '../../utils/contexts'

/**
 * @class A EcdsaKoblitz linked data signature implementation
 * @implements {ILinkedDataSignature}
 * @implements {IDigestible}
 * @internal
 */

@Exclude()
export class EcdsaLinkedDataSignature
  implements ILinkedDataSignature, IDigestible {
  private _type = 'EcdsaKoblitzSignature2016'
  private _creator: string = ''
  private _created: Date = new Date()
  private _nonce: string = ''
  private _signatureValue: string = ''
  private readonly _context = didDocumentContext

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
    return this._type
  }

  /**
   * Set the type of the linked data signature
   * @example `proof.type = 'EcdsaKoblitzSignature2016'`
   */

  set type(type: string) {
    this._type = type
  }

  /**
   * Get the random signature nonce
   * @example `console.log(proof.nonce) // 'abc...fe'`
   */

  @Expose()
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

  public async normalize() {
    return normalizeLdProof(this.toJSON(), this._context)
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

export const normalizeLdProof = (
  { ['@context']: _, ...proof }: ILinkedDataSignatureAttrs,
  context: JsonLdContext | JsonLdContext[],
): Promise<string> => {
  const { signatureValue, id, type, ...toNormalize } = proof
  return normalizeJsonLD(toNormalize, context)
}
