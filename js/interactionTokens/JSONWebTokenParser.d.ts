import { JSONWebToken } from './JSONWebToken';
import { IJSONWebTokenAttrs } from './types';
export declare const JSONWebTokenParser: {
    fromJWT: <T>(jwt: string) => JSONWebToken<T>;
    fromJSON: <T_1>(json: IJSONWebTokenAttrs) => JSONWebToken<T_1>;
};
