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

  @Expose()
  @Transform((value:Buffer) => value && value.toString('hex'), {toPlainOnly: true})
  @Transform((value:string) => Buffer.from(value, 'hex'), {toClassOnly: true})
  private signatureValue: Buffer

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
    return this.signatureValue
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

  public setSignatureValue(signatureValue: Buffer): void {
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
