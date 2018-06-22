import { DidDocument } from './didDocument'
import { IDidDocumentAttrs } from './didDocument/types'
import { SignedCredential } from '../credentials/signedCredential'

export interface IIdentityArgs {
  didDocument: DidDocument
  profile: SignedCredential
}

export class Identity extends DidDocument {
  private didDocument: IDidDocumentAttrs
  private profile: SignedCredential

  public static create({didDocument, profile}: IIdentityArgs): Identity {
    const identity = new Identity()
    identity.didDocument = didDocument
    identity.profile = profile

    return identity
  }

  public publicProfile = {
    get: this.profile
  }
}
