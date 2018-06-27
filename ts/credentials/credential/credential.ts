import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { IClaimAttrs, IClaimMetadata, ICredentialAttrs, ICredentialCreateAttrs } from './types'

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

  public static create({metadata, claim}: ICredentialCreateAttrs): Credential {
    const allPresent = metadata.fieldNames.every((field) => !!claim[field])
    if (!allPresent) {
      throw new Error(`Missing claims, expected keys are: ${metadata.fieldNames.toString()}`)
    }

    const assembledClaim = {
      id: claim.id
    }

    const combinedFieldNames = [...metadata.fieldNames, ...metadata.optionalFieldNames]

    combinedFieldNames.forEach((fieldName) => {
      if (claim[fieldName]) {
        assembledClaim[fieldName] = claim[fieldName]
      }
    })

    const credential = new Credential()
    credential['@context'] = metadata.context
    credential.type = metadata.type
    credential.name = metadata.name
    credential.claim = assembledClaim

    return credential
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
