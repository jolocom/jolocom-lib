import { Type, plainToClass, classToPlain, Exclude } from 'class-transformer'
import { canonize } from 'jsonld'
import { ILinkedDataSignature, proofTypes } from '../types'
import { sha256 } from '../../utils/crypto'
import { defaultContext } from '../../utils/contexts'

export class EcdsaLinkedDataSignature implements ILinkedDataSignature {
  public type = 'EcdsaKoblitzSignature2016'

  @Type(() => Date)
  public created: Date

  @Exclude()
  public proofSectionType: proofTypes

  public creator: string
  public nonce: string
  public signatureValue: string

  public getProofSectionType(): string {
    return this.proofSectionType
  }

  public fromJSON(json: ILinkedDataSignature): EcdsaLinkedDataSignature {
    return plainToClass(EcdsaLinkedDataSignature, json)
  }

  public toJSON(): ILinkedDataSignature {
    return classToPlain(this) as ILinkedDataSignature
  }

  public getSigValue(): Buffer {
    return Buffer.from(this.signatureValue, 'base64')
  }

  public async digest(): Promise<string> {
    const normalized = await this.normalize()
    return sha256(Buffer.from(normalized)).toString('hex')
  }

  private async normalize(): Promise<string> {
    const json = this.toJSON()

    json['@context'] = defaultContext
    delete json.signatureValue

    return canonize(json)
  }
}
