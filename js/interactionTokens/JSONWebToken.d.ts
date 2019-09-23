/// <reference types="node" />
import { IJWTHeader } from './types';
import { IJSONWebTokenAttrs, InteractionType } from './types';
import { IDigestable } from '../linkedDataSignature/types';
import { CredentialResponse } from './credentialResponse';
import { CredentialRequest } from './credentialRequest';
import { Authentication } from './authentication';
import { CredentialsReceive } from './credentialsReceive';
import { PaymentResponse } from './paymentResponse';
import { PaymentRequest } from './paymentRequest';
import { CredentialOfferResponse } from './credentialOfferResponse';
import { CredentialOfferRequest } from './credentialOfferRequest';
export declare type JWTEncodable = CredentialResponse | CredentialRequest | Authentication | CredentialOfferRequest | CredentialOfferResponse | CredentialsReceive | PaymentRequest | PaymentResponse;
interface IPayloadSection<T> {
    iat?: number;
    exp?: number;
    jti?: string;
    iss?: string;
    aud?: string;
    typ?: InteractionType;
    interactionToken?: T;
}
export declare class JSONWebToken<T extends JWTEncodable> implements IDigestable {
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
    interactionType: InteractionType;
    header: IJWTHeader;
    readonly signer: {
        did: string;
        keyId: string;
    };
    static fromJWTEncodable<T extends JWTEncodable>(toEncode: T): JSONWebToken<T>;
    timestampAndSetExpiry(expiry?: Date): void;
    static decode<T extends JWTEncodable>(jwt: string): JSONWebToken<T>;
    encode(): string;
    digest(): Promise<Buffer>;
    toJSON(): IJSONWebTokenAttrs;
    static fromJSON<T extends JWTEncodable>(json: IJSONWebTokenAttrs): JSONWebToken<T>;
}
export {};
