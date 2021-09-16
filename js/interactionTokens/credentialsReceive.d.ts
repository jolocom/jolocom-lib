import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { ICredentialsReceiveAttrs } from './interactionTokens.types';
export declare class CredentialsReceive {
    private _signedCredentials;
    signedCredentials: SignedCredential[];
    toJSON(): ICredentialsReceiveAttrs;
    static fromJSON(json: ICredentialsReceiveAttrs): CredentialsReceive;
}
