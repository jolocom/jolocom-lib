import { IClaimMetadata, IClaimAttrs } from './credential/types'
import { Credential } from './credential'
import { ISignedCredentialAttrs } from './signedCredential/types';
import { SignedCredential } from './signedCredential';

// Change in favor of instantiate / unsigned as per issues #85, #84
export class Credentials {
  public createCredential(metadata: IClaimMetadata, claim: IClaimAttrs) {
    return Credential.create(metadata, claim)
  }

  // TODO Depricate in favor of Parser / Unsigned modules
  public createVerifiableCredential() {
    return {
      fromJSON: this.verifiableCredentialFromJSON
    }
  }

  // TODO Depricate in favor of Parser / Unsigned modules
  private verifiableCredentialFromJSON(json: ISignedCredentialAttrs): SignedCredential {
    return SignedCredential.fromJSON(json)
  }
}
