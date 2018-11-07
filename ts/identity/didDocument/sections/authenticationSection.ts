import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IAuthenticationSectionAttrs } from './types'
import { PublicKeySection } from './publicKeySection'

const typeToAuthType = {
  Secp256k1VerificationKey2018: 'Secp256k1SignatureAuthentication2018',
}

/*
 * Class representing a DidDocument Authentication section
 * see: https://w3c-ccg.github.io/did-spec/#authentication
 */

@Exclude()
export class AuthenticationSection {
  private _publicKey: string
  private _type: string

  @Expose()
  get publicKey() {
    return this._publicKey
  }

  set publicKey(key: string) {
    this._publicKey = key
  }

  @Expose()
  get type() {
    return this._type
  }

  set type(type: string) {
    this._type = type
  }
  /*
   * @description - Generate a boilerplate Authentication section based on passed public key
   * @param publicKey - A secp256k1 public key that will be listed in the did document
   * @param publicKeySection - Instance of the PublicKeySection class to be referenced
   * @returns {Object} - Instance of the AuthenticationSection class
  */

  public static fromEcdsa(publicKeySection: PublicKeySection): AuthenticationSection {
    const authSection = new AuthenticationSection()
    authSection.publicKey = publicKeySection.id
    authSection.type = typeToAuthType[publicKeySection.type]

    return authSection
  }

  public toJSON(): IAuthenticationSectionAttrs {
    return classToPlain(this) as IAuthenticationSectionAttrs
  }

  public fromJSON(json: IAuthenticationSectionAttrs): AuthenticationSection {
    return plainToClass(AuthenticationSection, json)
  }
}
