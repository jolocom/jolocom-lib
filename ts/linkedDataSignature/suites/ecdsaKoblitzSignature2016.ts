import { Type, plainToClass, classToPlain, Exclude, Expose } from 'class-transformer'
import { canonize } from 'jsonld'
import { ILinkedDataSignature, proofTypes, ILinkedDataSignatureAttrs } from '../types'
import { sha256 } from '../../utils/crypto'
import { defaultContext } from '../../utils/contexts'

@Exclude()
export class EcdsaLinkedDataSignature implements ILinkedDataSignature {
  @Expose()
  public type = 'EcdsaKoblitzSignature2016'

  @Type(() => Date)
  @Expose()
  public created: Date

  public proofSectionType: proofTypes

  @Expose()
  public creator: string

  @Expose()
  public nonce: string

  @Expose()
  public signatureValue: string

  public getProofSectionType(): string {
    return this.proofSectionType
  }

  public fromJSON(json: ILinkedDataSignatureAttrs): EcdsaLinkedDataSignature {
    return plainToClass(EcdsaLinkedDataSignature, json)
  }

  public toJSON(): ILinkedDataSignatureAttrs {
    return classToPlain(this) as ILinkedDataSignatureAttrs
  }

  public getSigValue(): Buffer {
    return Buffer.from(this.signatureValue, 'base64')
  }

  public async digest(): Promise<string> {
    const normalized = await this.normalize()
    return sha256(Buffer.from(normalized)).toString('hex')
  }

  private async normalize(): Promise<string> {
    const json: ILinkedDataSignatureAttrs = this.toJSON()

    json['@context'] = defaultContext
    delete json.signatureValue

    return canonize(json)
  }
}
