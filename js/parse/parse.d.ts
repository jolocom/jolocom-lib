import { Credential } from '../credentials/credential/credential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { ICredentialAttrs } from '../credentials/credential/types';
import { ISignedCredentialAttrs } from '../credentials/signedCredential/types';
import { JSONWebToken, JWTEncodable } from '../interactionTokens/JSONWebToken';
import { IJSONWebTokenAttrs } from '../interactionTokens/types';
export interface ParseMethods {
    interactionToken: {
        fromJWT: <T extends JWTEncodable>(jwt: string) => JSONWebToken<T>;
        fromJSON: <T extends JWTEncodable>(json: IJSONWebTokenAttrs) => JSONWebToken<T>;
    };
    credential: (json: ICredentialAttrs) => Credential;
    signedCredential: (json: ISignedCredentialAttrs) => SignedCredential;
}
export declare const parse: ParseMethods;
