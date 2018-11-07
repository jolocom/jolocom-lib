import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { ICredentialAttrs, IClaimSection } from './types'
import { BaseMetadata, ContextEntry } from 'cred-types-jolocom-core'
import { defaultContext } from '../../utils/contexts'
import { ISignedCredCreationArgs } from '../signedCredential/types'

/**
 * @class
 * Class representing an unsigned verifiable credential.
 * @see {@link https://w3c.github.io/vc-data-model/ | verifiable credential specification}
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

  /**
   * @description - Returns the claim section from the credential
   */
  public getClaim(): IClaimSection {
    return this.claim
  }

  /**
   * @description - Returns the credential type
   * @returns {string[]} - credential type, e.g ['Credential', 'ProofOfNameCredential']
   */
  public getType(): string[] {
    return this.type
  }

  /**
   * @description - Returns a presentable credential name if present
   * @returns {string | undefined} - credential name, e.g. 'Email', 'Name'
   */
  public getName(): string {
    return this.name
  }

  /**
   * @description - Returns a presentable credential name if present
   * @returns {ContextEntry[]} - the '@context' section of the JSON-LD document
   * @see {@link https://json-ld.org/spec/latest/json-ld/#the-context | JSON-LD context}
   */
  public getContext(): ContextEntry[] {
    return this['@context']
  }

  /**
   * @description - Instantiates a {@link Credential} based on passed options
   * @param metadata - metadata necessary to create a valid JSON-LD document
   * @param claim - the claim
   * @param subject - the did of the subject
   * @see {@link https://jolocom-lib.readthedocs.io/en/latest/signedCredentials.html | developer documentation}
   * @returns {Credential}
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

  /**
   * @description - Instantiates a {@link Credential} from it's JSON form
   * @param json - credential in JSON-LD form
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   * @returns {Credential}
  */

  public static fromJSON(json: ICredentialAttrs): Credential {
    return plainToClass(Credential, json)
  }

  /**
   * @description - Serializes the {@link Credential} as a JSON-LD document
   * @see {@link https://w3c.github.io/vc-data-model/ | specification}
   * @returns {ICredentialAttrs} - JSON-LD encoded credential
   */

  public toJSON(): ICredentialAttrs {
    return classToPlain(this) as ICredentialAttrs
  }
}
