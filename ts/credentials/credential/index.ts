import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IClaimAttrs, IClaimMetadata, ICredentialAttrs } from './types'

@Exclude()
export class Credential {
  @Expose()
  private '@context': string[] | object[]

  @Expose()
  private type: string[]

  @Expose()
  private claim: IClaimAttrs

  @Expose()
  private name: string

  public static create(metadata: IClaimMetadata, claim: IClaimAttrs): Credential {
    const allPresent = metadata.fieldNames.every((field) => !!claim[field])

    if (!allPresent) {
      throw new Error(`Missing claims, expected keys are: ${metadata.fieldNames.toString()}`)
    }

    const cred = new Credential()
    cred['@context'] = metadata.context
    cred.type = metadata.type
    cred.name = metadata.name
    cred.claim = claim

    return cred
  }

  public getClaim(): IClaimAttrs {
    return this.claim
  }

  public getType(): string[] {
    return this.type
  }

  public getName(): string {
    return this.name
  }

  public getContext(): string[] | object[] {
    return this['@context']
  }

  public static fromJSON(json: ICredentialAttrs): Credential {
    return plainToClass(Credential, json)
  }

  public toJSON(): ICredentialAttrs {
    return classToPlain(this) as ICredentialAttrs
  }
}
