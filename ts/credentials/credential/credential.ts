import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { ICredentialAttrs, IClaimSection } from './types'
import { BaseMetadata, ContextEntry } from 'cred-types-jolocom-core'
import { defaultContext } from '../../utils/contexts'
import { ISignedCredCreationArgs } from '../../identityWallet/identityWallet'

/*
 * Class representing an unsigned JSON LD credential. Used together with a
 *  Linked Data Signature to form a signed credential
 */

@Exclude()
export class Credential {
  @Expose()
  private '@context': ContextEntry[]

  @Expose()
  private type: string[]

  @Expose()
  private claim: IClaimSection

  @Expose()
  private name: string

  public getClaim(): IClaimSection {
    return this.claim
  }

  public getType(): string[] {
    return this.type
  }

  public getName(): string {
    return this.name
  }

  public getContext(): ContextEntry[] {
    return this['@context']
  }

  /*
   * @description - Instantiates a Credential based on passed configuration
   * @param metadata - Metadata necessary to create a valid JSON-LD document
   *   see - https://jolocom-lib.readthedocs.io/en/latest/signedCredentials.html
   * @param claim - Data to store in claim, e.g. { email: 'test@gmail.com' }
   * @param subject - Did of the credential subject
   * @returns {Object} - Instance of Credential class
  */

  public static create<T extends BaseMetadata>({ metadata, claim, subject }: ISignedCredCreationArgs<T>) {
    const credential = new Credential()
    credential['@context'] = [...defaultContext, ...metadata.context]
    credential.type = metadata.type
    credential.name = metadata.name
    credential.claim = claim
    credential.claim.id = subject

    return credential
  }

  public static fromJSON(json: ICredentialAttrs): Credential {
    return plainToClass(Credential, json)
  }

  public toJSON(): ICredentialAttrs {
    return classToPlain(this) as ICredentialAttrs
  }
}
