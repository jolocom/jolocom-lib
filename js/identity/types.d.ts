import { SignedCredential } from '../credentials/outdated/signedCredential';
import { DidDocument } from './didDocument/didDocument';
export interface IIdentityCreateArgs {
    didDocument: DidDocument;
    publicProfile?: SignedCredential;
}
