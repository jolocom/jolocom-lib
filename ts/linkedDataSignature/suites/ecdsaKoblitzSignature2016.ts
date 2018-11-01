import 'reflect-metadata'
import { Type, plainToClass, classToPlain, Exclude, Expose, Transform } from 'class-transformer'
import { canonize } from 'jsonld'
import { ILinkedDataSignature, ILinkedDataSignatureAttrs, IDigestable } from '../types'
import { sha256 } from '../../utils/crypto'
import { defaultContext } from '../../utils/contexts'

@Exclude()
export class EcdsaLinkedDataSignature implements ILinkedDataSignature, IDigestable {
  @Expose()
  public type = 'EcdsaKoblitzSignature2016'

  @Expose()
  private creator: string

  @Expose()
  private nonce: string

  /* 
   * In case we are parsing a JSON LD doc with no signature, default to empty string 
   * In case sig is undefined on instance and we run toJSON, default to empty string
  */

  @Expose()
  @Transform(value => value || '', { toPlainOnly: true })
  private signatureValue: string

  @Expose()
  @Type(() => Date)
  @Transform((value: Date) => value && value.toISOString(), { toPlainOnly: true })
  @Transform((value: string) => new Date(value), { toClassOnly: true })
  private created: Date = new Date()

  public getCreator(): string {
    return this.creator
  }

  public getType(): string {
    return this.type
  }

  public getNonce(): string {
    return this.nonce
  }

  public getSignatureValue(): Buffer {
    return Buffer.from(this.signatureValue, 'hex')
  }

  public getCreationDate(): Date {
    return this.created
  }

  public setCreator(creator: string): void {
    this.creator = creator
  }

  public setNonce(nonce: string): void {
    this.nonce = nonce
  }

  public setSignatureValue(signatureValue: string): void {
    this.signatureValue = signatureValue
  }

  public setCreationDate(creation: Date): void {
    this.created = creation
  }

  private async normalize(): Promise<string> {
    const json: ILinkedDataSignatureAttrs = this.toJSON()

    json['@context'] = defaultContext
    delete json.signatureValue

    return canonize(json)
  }

  public async digest(): Promise<Buffer> {
    const normalized = await this.normalize()
    return sha256(Buffer.from(normalized))
  }

  public fromJSON(json: ILinkedDataSignatureAttrs): EcdsaLinkedDataSignature {
    return plainToClass(EcdsaLinkedDataSignature, json)
  }

  public toJSON(): ILinkedDataSignatureAttrs {
    return classToPlain(this) as ILinkedDataSignatureAttrs
  }
}
