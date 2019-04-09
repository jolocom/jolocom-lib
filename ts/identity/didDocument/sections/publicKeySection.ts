import 'reflect-metadata'
import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IPublicKeySectionAttrs } from './types'

/**
 * Class modelling a Did Document Pulic Key section
 * @memberof {@link DidDocument}
 * @see {@link https://w3c-ccg.github.io/did-spec/#public-keys | specification}
 * @internal
 * @ignore
 */

@Exclude()
export class PublicKeySection {
  private _id: string
  private _type: string
  private _owner: string
  private _publicKeyHex: string

  /**
   * Get the did of the public key owner
   */

  @Expose()
  get owner(): string {
    return this._owner
  }

  /**
   * Set the did of the public key owner
   */

  set owner(owner: string) {
    this._owner = owner
  }

  /**
   * Get the public key identifier
   */

  @Expose()
  get id(): string {
    return this._id
  }

  /**
   * Set the public key identifier
   */

  set id(id: string) {
    this._id = id
  }

  /**
   * Get the public key type
   */

  @Expose()
  get type(): string {
    return this._type
  }

  /**
   * Set the public key type
   */

  set type(type: string) {
    this._type = type
  }

  /**
   * Get the public key encoded as hex
   */

  @Expose()
  get publicKeyHex(): string {
    return this._publicKeyHex
  }

  /**
   * Set the public key
   */

  set publicKeyHex(keyHex: string) {
    this._publicKeyHex = keyHex
  }

  /**
   * Instantiates a boilerplate {@link PublicKeySection} based on the passed public key data
   * @param publicKey - A secp256k1 public key to be listed in the "publicKey" section of the did document
   * @param id - An identifier for the public key, normally #keys-X
   * @param did - The did listed in the did document, used to compute the full key id
   */

  public static fromEcdsa(
    publicKey: Buffer,
    id: string,
    did: string,
  ): PublicKeySection {
    const publicKeySecion = new PublicKeySection()
    publicKeySecion.owner = did
    publicKeySecion.id = id
    publicKeySecion.type = 'Secp256k1VerificationKey2018'
    publicKeySecion.publicKeyHex = publicKey.toString('hex')

    return publicKeySecion
  }

  /**
   * Serializes the {@link PublicKeySection} as JSON
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  public toJSON(): IPublicKeySectionAttrs {
    return classToPlain(this) as IPublicKeySectionAttrs
  }

  /**
   * Instantiates an {@link PublicKeySection} from it's JSON form
   * @param json - Section encoded as JSON
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   */

  public fromJSON(json: IPublicKeySectionAttrs): PublicKeySection {
    return plainToClass(PublicKeySection, json)
  }
}
