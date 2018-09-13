import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { ICredentialAttrs, IClaimSection } from './types'
import { BaseMetadata, validContextEntry } from 'cred-types-jolocom-core'

// TODO TODO TODO
const defaultContextsBrief = []

@Exclude()
export class Credential {
  @Expose()
  private '@context': Array<string | { [key: string]: string }>

  @Expose()
  private type: string[]

  @Expose()
  private claim: IClaimSection

  @Expose()
  private name: string

  public static create<T extends BaseMetadata>({
    metadata,
    claim,
    subject
  }: {
    metadata: T
    claim: typeof metadata['claimInterface']
    subject: string
  }) {
    const credential = new Credential()
    credential['@context'] = [...defaultContextsBrief, ...metadata.context]
    credential.type = metadata.type
    credential.name = metadata.name
    credential.claim = claim
    credential.claim.id = subject

    return credential
  }

  public getClaim(): IClaimSection {
    return this.claim
  }

  public getType(): string[] {
    return this.type
  }

  public getName(): string {
    return this.name
  }

  public getContext(): Array<validContextEntry> {
    return this['@context']
  }

  public static fromJSON(json: ICredentialAttrs): Credential {
    return plainToClass(Credential, json)
  }

  public toJSON(): ICredentialAttrs {
    return classToPlain(this) as ICredentialAttrs
  }
}
