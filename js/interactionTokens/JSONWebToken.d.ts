/// <reference types="node" />
import { IJWTHeader, SupportedJWA } from './types';
import { IJSONWebTokenAttrs } from './types';
import { IDigestable } from '../linkedDataSignature/types';
import { CredentialResponse } from './credentialResponse';
import { CredentialRequest } from './credentialRequest';
import { Authentication } from './authentication';
import { CredentialsReceive } from './credentialsReceive';
import { CredentialOfferResponse } from './credentialOfferResponse';
import { CredentialOfferRequest } from './credentialOfferRequest';
export declare type JWTEncodable = CredentialResponse | CredentialRequest | Authentication | CredentialOfferRequest | CredentialOfferResponse | CredentialsReceive;
interface IPayloadSection<T> {
    iat?: number;
    exp?: number;
    jti?: string;
    iss?: string;
    aud?: string;
    typ?: string;
    pca?: string;
    interactionToken?: T;
}
export declare class JSONWebToken<T> implements IDigestable {
    private _header;
    private _signature;
    private _payload;
    payload: IPayloadSection<T>;
    signature: string;
    issuer: string;
    audience: string;
    readonly issued: number;
    readonly expires: number;
    nonce: string;
    interactionToken: T;
    interactionType: string;
    header: IJWTHeader;
    readonly signer: {
        did: string;
        keyId: string;
    };
    static fromJWTEncodable<T>(toEncode: T, header?: {
        typ: string;
        alg: SupportedJWA;
    }): JSONWebToken<T>;
    timestampAndSetExpiry(expiry?: Date): void;
    setIssueAndExpiryTime: (expiry?: Date) => void;
    static decode<T>(jwt: string): JSONWebToken<T>;
    encode(): string;
    asBytes(): Promise<Buffer>;
    digest(): Promise<Buffer>;
    toJSON(): IJSONWebTokenAttrs;
    static fromJSON<T>(json: IJSONWebTokenAttrs): JSONWebToken<T>;
}
export {};
