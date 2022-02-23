import { IDidDocumentAttrs } from '@jolocom/protocol-ts';
import { DidDocument } from './didDocument/didDocument';
import { SignedCredential } from '../credentials/outdated/signedCredential';
import { IIdentityCreateArgs } from './types';
import { ISignedCredentialAttrs } from '../credentials/types';
interface IdentityAttributes {
    didDocument: IDidDocumentAttrs;
    publicProfile?: ISignedCredentialAttrs;
}
export declare class Identity {
    private _didDocument;
    private _publicProfileCredential?;
    did: string;
    didDocument: DidDocument;
    readonly serviceEndpointSections: import("./didDocument/sections").ServiceEndpointsSection[];
    readonly publicKeySection: import("./didDocument/sections").PublicKeySection[];
    publicProfile: SignedCredential | undefined;
    static fromDidDocument({ didDocument, publicProfile, }: IIdentityCreateArgs): Identity;
    toJSON(): IdentityAttributes;
    static fromJSON(json: IdentityAttributes): Identity;
}
export {};
