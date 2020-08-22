import { IDidDocumentAttrs } from '../identity/didDocument/types';
import { DidDocument } from '../identity/didDocument/didDocument';
import { JWTEncodable, JSONWebToken } from '../interactionTokens/JSONWebToken';
import { Identity } from '../identity/identity';
import { ISignedCredentialAttrs } from '@jolocom/protocol-ts/dist/lib/signedCredential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
export declare const parseAndValidateInteractionToken: (jwt: string, signer: Identity) => Promise<JSONWebToken<JWTEncodable>>;
export declare const parseAndValidate: {
    interactionToken: (jwt: string, signer: Identity) => Promise<JSONWebToken<JWTEncodable>>;
    didDocument: (didDocument: IDidDocumentAttrs) => Promise<DidDocument>;
    signedCredential: (signedCredential: ISignedCredentialAttrs, signer: Identity) => Promise<SignedCredential>;
};
