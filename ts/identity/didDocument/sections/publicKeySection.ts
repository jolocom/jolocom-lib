import 'reflect-metadata'
import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IPublicKeySectionAttrs } from './types'

/**
 * Class representing a DidDocument Public Key section
 * see: https://w3c-ccg.github.io/did-spec/#public-keys
 */

@Exclude()
export class PublicKeySection {
  private _id: string
  private _type: string
  private _owner: string
  private _publicKeyHex: string

  @Expose()
  get owner(): string {
    return this._owner
  }

  set owner(owner: string) {
    this._owner = owner
  }

  @Expose()
  get id(): string {
    return this._id
  }

  set id(id: string) {
    this._id = id
  }

  @Expose()
  get type(): string {
    return this._type
  }

  set type(type: string) {
    this._type = type
  }

  @Expose()
  get publicKeyHex(): string {
    return this._publicKeyHex
  }

  set publicKeyHex(keyHex: string) {
    this._publicKeyHex = keyHex
  }

  /**
   * @description - Generates a boilerplate Public Key section based on the passed public key
   * @param publicKey - A secp256k1 public key to be listed in the "publicKey" section of the did document
   * @param id - An identifier for the public key, normally #keys-X
   * @param did - The did listed in the did document, used to compute the full key id
   * @returns {Object} - Instance of the PublicKeySection class
   */

  public static fromEcdsa(publicKey: Buffer, id: string, did: string): PublicKeySection {
    const publicKeySecion = new PublicKeySection()
    publicKeySecion.owner = did
    publicKeySecion.id = id
    publicKeySecion.type = 'Secp256k1VerificationKey2018'
    publicKeySecion.publicKeyHex = publicKey.toString('hex')

    return publicKeySecion
  }

  public toJSON(): IPublicKeySectionAttrs {
    return classToPlain(this) as IPublicKeySectionAttrs
  }

  public fromJSON(json: IPublicKeySectionAttrs): PublicKeySection {
    return plainToClass(PublicKeySection, json)
  }
}
