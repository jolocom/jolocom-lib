import 'reflect-metadata'
import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IPublicKeySectionAttrs } from './types'

/*
 * Class representing a DidDocument Public Key section
 * see: https://w3c-ccg.github.io/did-spec/#public-keys
 */

@Exclude()
export class PublicKeySection {
  @Expose()
  private id: string

  @Expose()
  private type: string

  @Expose()
  private owner: string

  @Expose()
  private publicKeyHex: string

  public getOnwer(): string {
    return this.owner
  }

  public getIdentifier(): string {
    return this.id
  }

  public getType(): string {
    return this.type
  }

  public getPublicKeyHex(): string {
    return this.publicKeyHex
  }

  /*
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