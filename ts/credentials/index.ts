import { IClaimMetadata } from './credential/types'
import { Credential } from './credential'
import { IVerifiableCredential } from './verifiableCredential/types';
import { VerifiableCredential } from './verifiableCredential';

export class Credentials {
  public createCredential(metadata: IClaimMetadata, value: string, subject: string) {
    return new Credential().assemble(metadata, value, subject)
  }

  public createVerifiableCredential() {
    return {
      fromJSON: this.verifiableCredentialFromJSON
    }
  }

  private verifiableCredentialFromJSON(json: IVerifiableCredential): VerifiableCredential {
    return new VerifiableCredential().fromJSON(json)
  }
}
