import { SignedCredential } from '../credentials/signedCredential/signedCredential'
import { DidDocument } from './didDocument/didDocument'

export interface IIdentityCreateArgs {
  didDocument: DidDocument
  publicProfile?: SignedCredential
}
