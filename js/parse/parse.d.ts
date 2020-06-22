import { Credential } from '../credentials/credential/credential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { ICredentialAttrs } from '../credentials/credential/types';
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types';
import { JSONWebToken } from '../interactionTokens/JSONWebToken';
import { IJSONWebTokenAttrs } from '../interactionTokens/types';
export interface ParseMethods {
    interactionToken: {
        fromJWT: <T>(jwt: string) => JSONWebToken<T>;
        fromJSON: <T>(json: IJSONWebTokenAttrs) => JSONWebToken<T>;
    };
    credential: (json: ICredentialAttrs) => Credential;
    signedCredential: (json: ISignedCredentialAttrs) => SignedCredential;
}
export declare const parse: ParseMethods;
