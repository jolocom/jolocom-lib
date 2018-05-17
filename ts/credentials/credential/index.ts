import { classToPlain, plainToClass } from 'class-transformer'
import { IClaim, IClaimMetadata, ICredential } from './types'

export class Credential {
  private '@context': string[] | object[]
  private type: string[]
  private claim: IClaim

  public assemble(metadata: IClaimMetadata, value: string, subject: string): Credential {
    const cred = new Credential()
    cred.type = metadata.type
    cred['@context'] = metadata.context
    cred.claim = {
      id: subject,
      [metadata.fieldName]: value
    }

    return cred
  }

  public getClaim(): IClaim {
    return this.claim
  }

  public getType(): string[] {
    return this.type
  }

  public getContext(): string[] | object[] {
    return this['@context']
  }

  public fromJSON(json: ICredential): Credential {
    return plainToClass(Credential, json)
  }

  public toJSON(credential: Credential): ICredential {
    return classToPlain(this) as ICredential
  }
}
