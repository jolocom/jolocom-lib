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
    get payload(): IPayloadSection<T>;
    set payload(payload: IPayloadSection<T>);
    get signature(): string;
    set signature(signature: string);
    get issuer(): string;
    set issuer(issuer: string);
    get audience(): string;
    set audience(audience: string);
    get issued(): number;
    get expires(): number;
    get nonce(): string;
    set nonce(nonce: string);
    get interactionToken(): T;
    set interactionToken(interactionToken: T);
    get interactionType(): string;
    set interactionType(type: string);
    get header(): IJWTHeader;
    set header(jwtHeader: IJWTHeader);
    get signer(): {
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
