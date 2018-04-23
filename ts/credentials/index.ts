import { IClaimMetadata } from './credential/types'
import { Credential } from './credential'

export class Credentials {
  public createCredential(metadata: IClaimMetadata, value: string, subject: string) {
    return new Credential().assemble(metadata, value, subject)
  }
}
