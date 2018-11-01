import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IAuthenticationSectionAttrs } from './types'
import { PublicKeySection } from './publicKeySection'

const typeToAuthType = {
  Secp256k1VerificationKey2018: 'Secp256k1SignatureAuthentication2018'
}

/*
 * Class representing a DidDocument Authentication section
 * see: https://w3c-ccg.github.io/did-spec/#authentication
 */

@Exclude()
export class AuthenticationSection {
  @Expose()
  private publicKey: string

  @Expose()
  private type: string

  public getPublicKey(): string {
    return this.publicKey
  }

  public getType(): string {
    return this.type
  }

  /*
   * @description - Generate a boilerplate Authentication section based on passed public key
   * @param publicKey - A secp256k1 public key that will be listed in the did document
   * @param publicKeySection - Instance of the PublicKeySection class to be referenced
   * @returns {Object} - Instance of the AuthenticationSection class
  */

  public static fromEcdsa(publicKeySection: PublicKeySection): AuthenticationSection {
    const authSection = new AuthenticationSection()
    authSection.publicKey = publicKeySection.getIdentifier()
    authSection.type = typeToAuthType[publicKeySection.getType()]

    return authSection
  }

  public toJSON(): IAuthenticationSectionAttrs {
    return classToPlain(this) as IAuthenticationSectionAttrs
  }

  public fromJSON(json: IAuthenticationSectionAttrs): AuthenticationSection {
    return plainToClass(AuthenticationSection, json)
  }
}
