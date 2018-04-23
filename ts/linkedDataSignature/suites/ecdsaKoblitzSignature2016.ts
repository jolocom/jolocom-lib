import { Type, plainToClass, classToPlain } from 'class-transformer'
import { canonize } from 'jsonld'
import { ILinkedDataSignature } from '../types'
import { sha256 } from '../../utils/crypto'

export class EcdsaLinkedDataSignature implements ILinkedDataSignature {
  public type = 'EcdsaKoblitzSignature2016'

  @Type(() => Date)
  public created: Date

  public creator: string
  public nonce: string
  public signatureValue: string

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

  // TODO HAVE A COMMON LARGE NORMALIZATION CONTEXT
  private async normalize(): Promise<string> {
    const json = this.toJSON()
    json['@context'] = ['https://w3id.org/security/v1']

    delete json.signatureValue
    return canonize(json)
  }
}
