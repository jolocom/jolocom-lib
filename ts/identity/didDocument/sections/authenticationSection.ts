import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IAuthenticationSectionAttrs } from './types'
import { PublicKeySection } from './publicKeySection'

@Exclude()
export class AuthenticationSection {
  @Expose()
  private id: string

  @Expose()
  private type: string

  public fromEcdsa(publicKey: PublicKeySection): AuthenticationSection {
    const authSection = new AuthenticationSection()
    authSection.id = publicKey.getIdentifier()
    authSection.type = publicKey.getType()

    return authSection
  }

  public toJSON(): IAuthenticationSectionAttrs {
    return classToPlain(this) as IAuthenticationSectionAttrs
  }

  public fromJSON(json: IAuthenticationSectionAttrs): AuthenticationSection {
    return plainToClass(AuthenticationSection, json)
  }
}
