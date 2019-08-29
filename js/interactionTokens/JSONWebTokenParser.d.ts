import { JSONWebToken } from './JSONWebToken';
export declare const JSONWebTokenParser: {
    fromJWT: typeof JSONWebToken.decode;
    fromJSON: typeof JSONWebToken.fromJSON;
};
