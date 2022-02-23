import { Credential } from '../credentials/outdated/credential';
import { SignedCredential } from '../credentials/outdated/signedCredential';
import { ICredentialAttrs, ISignedCredentialAttrs } from '../credentials/types';
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
