import { Credential } from '../credentials/credential/credential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
export declare const parse: {
    interactionToken: {
        fromJWT: typeof import("../interactionTokens/JSONWebToken").JSONWebToken.decode;
        fromJSON: typeof import("../interactionTokens/JSONWebToken").JSONWebToken.fromJSON;
    };
    credential: typeof Credential.fromJSON;
    signedCredential: typeof SignedCredential.fromJSON;
};
