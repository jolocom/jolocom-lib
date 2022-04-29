import { IDidDocumentAttrs } from '@jolocom/protocol-ts';
import { DidDocument } from './didDocument/didDocument';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { IIdentityCreateArgs } from './types';
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types';
interface IdentityAttributes {
    didDocument: IDidDocumentAttrs;
    publicProfile?: ISignedCredentialAttrs;
}
export declare class Identity {
    private _didDocument;
    private _publicProfileCredential?;
    get did(): string;
    set did(did: string);
    get didDocument(): DidDocument;
    set didDocument(didDocument: DidDocument);
    get serviceEndpointSections(): import("./didDocument/sections").ServiceEndpointsSection[];
    get publicKeySection(): import("./didDocument/sections").PublicKeySection[];
    get publicProfile(): SignedCredential | undefined;
    set publicProfile(publicProfile: SignedCredential | undefined);
    static fromDidDocument({ didDocument, publicProfile, }: IIdentityCreateArgs): Identity;
    toJSON(): IdentityAttributes;
    static fromJSON(json: IdentityAttributes): Identity;
}
export {};
