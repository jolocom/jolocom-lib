import { DidDocument } from './didDocument'
import { SignedCredential } from '../credentials/signedCredential'
import { IIdentityCreateArgs } from './types'

export class Identity {
  private didDocument: DidDocument
  private profile: SignedCredential

  public static create({didDocument, profile}: IIdentityCreateArgs): Identity {
    const identity = new Identity()
    identity.profile = profile
    identity.didDocument = DidDocument.fromJSON(didDocument)

    return identity
  }

  public publicProfile = {
    get: this.profile
  }
}
