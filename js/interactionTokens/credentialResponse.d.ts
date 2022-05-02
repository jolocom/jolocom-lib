import { ICredentialResponseAttrs } from './interactionTokens.types';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { CredentialRequest } from './credentialRequest';
export declare class CredentialResponse {
    private _callbackURL;
    private _suppliedCredentials;
    get suppliedCredentials(): SignedCredential[];
    set suppliedCredentials(suppliedCredentials: SignedCredential[]);
    get callbackURL(): string;
    set callbackURL(callbackURL: string);
    satisfiesRequest(cr: CredentialRequest): boolean;
    toJSON(): ICredentialResponseAttrs;
    static fromJSON(json: ICredentialResponseAttrs): CredentialResponse;
}
