import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IAuthenticationSectionAttrs } from './types'
import { PublicKeySection } from './publicKeySection'

const typeToAuthType = {
  Secp256k1VerificationKey2018: 'Secp256k1SignatureAuthentication2018'
}

/**
 * Class modelling a Did Document Authentication section
 * @memberof {@link DidDocument}
 * @see {@link https://w3c-ccg.github.io/did-spec/#authentication | specification}
 */
@Exclude()
export class AuthenticationSection {
  private _publicKey: string
  private _type: string

  /**
   * Reference to a public key that will be used during did authentication
   * @see {@link https://w3c-ccg.github.io/did-spec/#authentication | specification}
   */
  @Expose()
  get publicKey(): string {
    return this._publicKey
  }

  set publicKey(key: string) {
    this._publicKey = key
  }

  @Expose()
  public get type(): string {
    return this._type
  }

  /**
   * The type of the listed public key
   * @param {string} type - the type of the public key
   * @see {@link https://w3c-ccg.github.io/did-spec/#authentication | specification}
   */
  public set type(type: string) {
    this._type = type
  }

  /**
   * @description - Instantiates a barebones {@link AuthenticationSection} section based on a public key
   * @param {PublicKeySection} publicKeySection - Instance of the {@link PublicKeySection} class to reference
   * @returns {AuthenticationSection} - Instance of the {@link AuthenticationSection} class
   */
  public static fromEcdsa(publicKeySection: PublicKeySection): AuthenticationSection {
    const authSection = new AuthenticationSection()
    authSection.publicKey = publicKeySection.id
    authSection.type = typeToAuthType[publicKeySection.type]

    return authSection
  }

  /**
   * @description - Serializes the {@link AuthenticationSection} as JSON
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   * @returns {IAuthenticationSectionAttrs} - A JSON encoded authentication section
   */
  public toJSON(): IAuthenticationSectionAttrs {
    return classToPlain(this) as IAuthenticationSectionAttrs
  }

  /**
   * @description - Instantiates an {@link AuthenticationSection} from it's JSON form
   * @param json - Section encoded as JSON
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   * @returns {AuthenticationSection}
   */
  public fromJSON(json: IAuthenticationSectionAttrs): AuthenticationSection {
    return plainToClass(AuthenticationSection, json)
  }
}
