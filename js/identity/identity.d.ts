import { DidDocument } from './didDocument/didDocument';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { IIdentityCreateArgs } from './types';
export declare class Identity {
    private _didDocument;
    private _publicProfileCredential?;
    did: string;
    didDocument: DidDocument;
    readonly serviceEndpointSections: import("./didDocument/sections/serviceEndpointsSection").ServiceEndpointsSection[];
    readonly publicKeySection: import("./didDocument/sections/publicKeySection").PublicKeySection[];
    publicProfile: SignedCredential | undefined;
    static fromDidDocument({ didDocument, publicProfile }: IIdentityCreateArgs): Identity;
}
