import 'reflect-metadata'
import {
  classToPlain,
  plainToClass,
  Exclude,
  Expose,
  Transform,
} from 'class-transformer'
import { IPublicKeySectionAttrs } from '@jolocom/protocol-ts'

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
  private _controller: string
  private _publicKeyHex: string

  /**
   * Get the did of the public key owner
   */

  @Expose()
  @Transform((val, obj) => val || (obj.id && obj.id.split('#')[0]), {
    toClassOnly: true,
    until: 0.13,
  })
  @Transform((val, obj) => obj.owner || val, { toClassOnly: true, until: 0.13 })
  public get controller(): string {
    return this._controller
  }

  /**
   * Set the did of the public key owner
   */

  public set controller(controller: string) {
    this._controller = controller
  }

  /**
   * Get the public key identifier
   */

  @Expose()
  public get id(): string {
    return this._id
  }

  /**
   * Set the public key identifier
   */

  public set id(id: string) {
    this._id = id
  }

  /**
   * Get the public key type
   */

  @Expose()
  public get type(): string {
    return this._type
  }

  /**
   * Set the public key type
   */

  public set type(type: string) {
    this._type = type
  }

  /**
   * Get the public key encoded as hex
   */

  @Expose()
  @Transform(
    (val, obj) =>
      !val && obj.publicKeyBase64
        ? Buffer.from(obj.publicKeyBase64, 'base64').toString('hex')
        : val,
    {
      toClassOnly: true,
    },
  )
  public get publicKeyHex(): string {
    return this._publicKeyHex
  }

  /**
   * Set the public key
   */

  public set publicKeyHex(keyHex: string) {
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
    publicKeySecion.controller = did
    publicKeySecion.id = id
    publicKeySecion.type = 'EcdsaSecp256k1VerificationKey2019'
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

  public static fromJSON(json: IPublicKeySectionAttrs): PublicKeySection {
    return plainToClass(PublicKeySection, json)
  }
}
