import { ICredentialResponseAttrs } from './interactionTokens.types';
import { SignedCredential } from '../credentials/outdated/signedCredential';
import { CredentialRequest } from './credentialRequest';
export declare class CredentialResponse {
    private _callbackURL;
    private _suppliedCredentials;
    suppliedCredentials: SignedCredential[];
    callbackURL: string;
    satisfiesRequest(cr: CredentialRequest): boolean;
    toJSON(): ICredentialResponseAttrs;
    static fromJSON(json: ICredentialResponseAttrs): CredentialResponse;
}
