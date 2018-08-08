import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IAuthenticationSectionAttrs } from './types'
import { PublicKeySection } from './publicKeySection'

const typeToAuthType = {
  Secp256k1VerificationKey2018: 'Secp256k1SignatureAuthentication2018'
}

@Exclude()
export class AuthenticationSection {
  @Expose()
  private publicKey: string

  @Expose()
  private type: string

  public fromEcdsa(publicKey: PublicKeySection): AuthenticationSection {
    const authSection = new AuthenticationSection()
    authSection.publicKey = publicKey.getIdentifier()
    authSection.type = typeToAuthType[publicKey.getType()]

    return authSection
  }

  public toJSON(): IAuthenticationSectionAttrs {
    return classToPlain(this) as IAuthenticationSectionAttrs
  }

  public fromJSON(json: IAuthenticationSectionAttrs): AuthenticationSection {
    return plainToClass(AuthenticationSection, json)
  }
}
