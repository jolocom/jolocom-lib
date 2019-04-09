import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IAuthenticationSectionAttrs } from './types'
import { PublicKeySection } from './publicKeySection'

const typeToAuthType = {
  Secp256k1VerificationKey2018: 'Secp256k1SignatureAuthentication2018',
}

/**
 * Class modelling a Did Document Authentication section
 * @memberof {@link DidDocument}
 * @see {@link https://w3c-ccg.github.io/did-spec/#authentication | specification}
 * @internal
 * @ignore
 */

@Exclude()
export class AuthenticationSection {
  private _publicKey: string
  private _type: string

  /**
   * Get the id of the public key
   */

  @Expose()
  get publicKey(): string {
    return this._publicKey
  }

  /**
   * Set the id of the public key
   */

  set publicKey(key: string) {
    this._publicKey = key
  }

  /**
   * Get the authentication type
   */

  @Expose()
  public get type(): string {
    return this._type
  }

  /**
   * Set the authentication type
   */

  public set type(type: string) {
    this._type = type
  }

  /**
   * Instantiates a barebones {@link AuthenticationSection} section based on a public key
   * @param {PublicKeySection} publicKeySection - Instance of the {@link PublicKeySection} class to reference
   * @returns {AuthenticationSection}
   */

  public static fromEcdsa(
    publicKeySection: PublicKeySection,
  ): AuthenticationSection {
    const authSection = new AuthenticationSection()
    authSection.publicKey = publicKeySection.id
    authSection.type = typeToAuthType[publicKeySection.type]

    return authSection
  }

  /**
   * Serializes the {@link AuthenticationSection} as JSON
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  public toJSON(): IAuthenticationSectionAttrs {
    return classToPlain(this) as IAuthenticationSectionAttrs
  }

  /**
   * Instantiates an {@link AuthenticationSection} from it's JSON form
   * @param json - Section encoded as JSON
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  public fromJSON(json: IAuthenticationSectionAttrs): AuthenticationSection {
    return plainToClass(AuthenticationSection, json)
  }
}
