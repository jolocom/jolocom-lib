import { classToPlain, plainToClass } from 'class-transformer'
import { IClaim, IClaimMetadata, ICredential } from './types'

// TODO REPLACE CONTEXT WITH LOCAL DEFINITON
export class Credential {
  private '@context' = [
    'http://schema.org',
    'https://w3id.org/credentials/v1'
  ]

  private type: string[]
  private claim: IClaim

  public assemble(metadata: IClaimMetadata, value: string, subject: string): Credential {
    const cred = new Credential()
    cred.type = metadata.type
    cred.claim = {
      id: subject,
      [metadata.fieldName]: value
    }

    if (metadata.context) {
      cred['@context'].concat(metadata.context)
    }

    return cred
  }

  public getClaim(): IClaim {
    return this.claim
  }

  public getType(): string[] {
    return this.type
  }

  public getContext(): string[] {
    return this['@context']
  }

  public fromJSON(json: ICredential): Credential {
    return plainToClass(Credential, json)
  }

  public toJSON(credential: Credential): ICredential {
    return classToPlain(this) as ICredential
  }
}
