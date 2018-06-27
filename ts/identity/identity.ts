import { DidDocument } from './didDocument'
import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { IIdentityCreateArgs } from './types'

export class Identity {
  public didDocument: DidDocument
  private profile: SignedCredential

  public static create({didDocument, profile}: IIdentityCreateArgs): Identity {
    const identity = new Identity()
    identity.profile = profile
    identity.didDocument = DidDocument.fromJSON(didDocument)

    return identity
  }

  public publicProfile = {
    get: this.getPublicProfile.bind(this)
  }

  private getPublicProfile() {
    if ( !this.profile ) { throw new Error('No public Profile available') }
    return this.profile.getCredentialSection()
  }
}
