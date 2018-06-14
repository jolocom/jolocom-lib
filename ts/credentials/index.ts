import { IClaimMetadata } from './credential/types'
import { Credential } from './credential'
import { IVerifiableCredentialAttrs } from './verifiableCredential/types';
import { VerifiableCredential } from './verifiableCredential';

// Change in favor of instantiate / unsigned as per issues #85, #84
export class Credentials {
  public createCredential(metadata: IClaimMetadata, value: string, subject: string) {
    return new Credential().assemble(metadata, value, subject)
  }

  public createVerifiableCredential() {
    return {
      fromJSON: this.verifiableCredentialFromJSON
    }
  }

  private verifiableCredentialFromJSON(json: IVerifiableCredentialAttrs): VerifiableCredential {
    return VerifiableCredential.fromJSON(json)
  }
}
