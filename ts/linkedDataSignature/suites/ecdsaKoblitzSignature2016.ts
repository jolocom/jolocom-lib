import 'reflect-metadata'
import { Type, plainToClass, classToPlain, Exclude, Expose, Transform } from 'class-transformer'
import { canonize } from 'jsonld'
import { ILinkedDataSignature, ILinkedDataSignatureAttrs, IDigestable } from '../types'
import { sha256 } from '../../utils/crypto'
import { defaultContext } from '../../utils/contexts'

@Exclude()
export class EcdsaLinkedDataSignature implements ILinkedDataSignature, IDigestable {
  private _type = 'EcdsaKoblitzSignature2016'
  private _creator: string = ''
  private _created: Date = new Date()
  private _nonce: string = ''
  private _signatureValue: string = ''

  @Expose()
  @Type(() => Date)
  @Transform((value: Date) => value && value.toISOString(), { toPlainOnly: true })
  get created() {
    return this._created
  }

  set created(created: Date) {
    this._created = created
  }

  @Expose()
  get type() {
    return this._type
  }

  set type(type: string) {
    this._type = type
  }

  @Expose()
  get nonce() {
    return this._nonce
  }

  set nonce(nonce: string) {
    this._nonce = nonce
  }

  @Expose()
  get signatureValue() {
    return this._signatureValue
  }

  set signatureValue(signature: string) {
    this._signatureValue = signature
  }

  @Expose()
  get creator(): string {
    return this._creator
  }

  set creator(creator: string) {
    this._creator = creator
  }

  /*
   * @description - Converts JSON-LD signature to canonical form
   *  see https://w3c-dvcg.github.io/ld-signatures/#signature-algorithm
   * @returns {Object} - Document in normalized form, quads
  */

  private async normalize(): Promise<string> {
    const json: ILinkedDataSignatureAttrs = this.toJSON()

    json['@context'] = defaultContext
    delete json.signatureValue

    return canonize(json)
  }

  /*
   * @description - Computes a 256 bit digest that can be signed later
   * @returns {Buffer} - 32 byte sha256 digest of normalized JSON-LD signature
  */

  public async digest(): Promise<Buffer> {
    const normalized = await this.normalize()
    return sha256(Buffer.from(normalized))
  }

  public static fromJSON(json: ILinkedDataSignatureAttrs): EcdsaLinkedDataSignature {
    return plainToClass(EcdsaLinkedDataSignature, json)
  }

  public toJSON(): ILinkedDataSignatureAttrs {
    return classToPlain(this) as ILinkedDataSignatureAttrs
  }
}
