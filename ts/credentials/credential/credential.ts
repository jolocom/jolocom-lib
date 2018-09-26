import { classToPlain, plainToClass, Exclude, Expose } from 'class-transformer'
import { ICredentialAttrs, IClaimSection } from './types'
import { BaseMetadata, ContextEntry } from 'cred-types-jolocom-core'
import { defaultContext } from '../../utils/contexts'

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
    credential['@context'] = [...defaultContext, ...metadata.context]
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

  public getContext(): ContextEntry[] {
    return this['@context']
  }

  public static fromJSON(json: ICredentialAttrs): Credential {
    return plainToClass(Credential, json)
  }

  public toJSON(): ICredentialAttrs {
    return classToPlain(this) as ICredentialAttrs
  }
}
