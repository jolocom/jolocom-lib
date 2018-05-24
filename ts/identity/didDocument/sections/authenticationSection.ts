import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IAuthenticationSection } from './types'
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

  public toJSON(): IAuthenticationSection {
    return classToPlain(this) as IAuthenticationSection
  }

  public fromJSON(json: IAuthenticationSection): AuthenticationSection {
    return plainToClass(AuthenticationSection, json)
  }
}
