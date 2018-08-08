import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IPublicKeySectionAttrs } from './types'
import 'reflect-metadata'

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
    pKeySection.type = 'Secp256k1VerificationKey2018'
    pKeySection.publicKeyHex = publicKey.toString('hex')

    return pKeySection
  }

  public getIdentifier(): string {
    return this.id
  }

  public getType(): string {
    return this.type
  }

  public toJSON(): IPublicKeySectionAttrs {
    return classToPlain(this) as IPublicKeySectionAttrs
  }

  public fromJSON(json: IPublicKeySectionAttrs): PublicKeySection {
    return plainToClass(PublicKeySection, json)
  }
}
