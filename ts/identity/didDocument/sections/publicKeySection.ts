import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IPublicKeySection } from './types'

@Exclude()
export class PublicKeySection {
  @Expose()
  private id: string

  @Expose()
  private 'type': string

  @Expose()
  private publicKeyHex: string

  public fromEcdsa(publicKey: Buffer, id: string): PublicKeySection {
    const pKeySection = new PublicKeySection()
    pKeySection.id = id
    pKeySection.type = 'EdDsaSAPublicKeySecp256k1'
    pKeySection.publicKeyHex = publicKey.toString('hex')

    return pKeySection
  }

  public getIdentifier(): string {
    return this.id
  }

  public getType(): string {
    return this.type
  }

  public toJSON(): IPublicKeySection {
    return classToPlain(this) as IPublicKeySection
  }

  public fromJSON(json: IPublicKeySection): PublicKeySection {
    return plainToClass(PublicKeySection, json)
  }
}
