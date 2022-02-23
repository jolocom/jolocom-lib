/// <reference types="node" />
import { BaseMetadata } from '@jolocom/protocol-ts';
import { Credential } from '../credentials/outdated/credential';
import { SignedCredential } from '../credentials/outdated/signedCredential';
import { ExclusivePartial, IKeyMetadata, IIdentityWalletCreateArgs } from './types';
import { Identity } from '../identity/identity';
import { JSONWebToken } from '../interactionTokens/JSONWebToken';
import { Authentication } from '../interactionTokens/authentication';
import { CredentialRequest } from '../interactionTokens/credentialRequest';
import { ISignedCredCreationArgs } from '../credentials/types';
import { CredentialOfferRequest } from '../interactionTokens/credentialOfferRequest';
import { CredentialOfferResponse } from '../interactionTokens/credentialOfferResponse';
import { CredentialOfferRequestAttrs, CredentialOfferResponseAttrs, IAuthenticationAttrs, ICredentialRequestAttrs, ICredentialResponseAttrs, ICredentialsReceiveAttrs } from '../interactionTokens/interactionTokens.types';
import { KeyTypes } from '@jolocom/vaulted-key-provider';
import { IResolver } from '../didMethods/types';
declare type WithExtraOptions<T> = T & {
    expires?: Date;
    aud?: string;
    pca?: string;
};
export declare class IdentityWallet {
    private _identity;
    private _publicKeyMetadata;
    private _keyProvider;
    did: string;
    identity: Identity;
    didDocument: import("../identity/didDocument/didDocument").DidDocument;
    publicKeyMetadata: IKeyMetadata;
    constructor({ identity, publicKeyMetadata, vaultedKeyProvider, }: IIdentityWalletCreateArgs);
    private createSignedCred;
    private createMessage;
    private makeReq;
    private makeRes;
    private messageCannonicaliser;
    getPublicKeys: (encryptionPass: string) => Promise<import("@jolocom/vaulted-key-provider").PublicKeyInfo[]>;
    private initializeAndSign;
    validateJWT<T, R>(receivedJWT: JSONWebToken<T>, sentJWT?: JSONWebToken<R>, resolver?: IResolver): Promise<void>;
    asymEncrypt: (data: Buffer, key: Buffer, type: KeyTypes) => Promise<Buffer>;
    asymEncryptToDidKey: (data: Buffer, keyRef: string, resolver?: IResolver) => Promise<Buffer>;
    asymEncryptToDid: (data: Buffer, did: string, resolver?: IResolver) => Promise<Buffer>;
    asymDecrypt: (data: Buffer, pass: string) => Promise<Buffer>;
    sign: (data: Buffer, pass: string) => Promise<Buffer>;
    create: {
        credential: typeof Credential.create;
        signedCredential: <T extends BaseMetadata>({ expires, ...credentialParams }: WithExtraOptions<ISignedCredCreationArgs<T>>, pass: string) => Promise<SignedCredential>;
        message: <T_1, R>(args: {
            message: T_1;
            typ: string;
            expires?: Date;
            aud?: string;
            pca?: string;
        }, pass: string, recieved?: JSONWebToken<R>) => Promise<JSONWebToken<T_1>>;
        interactionTokens: {
            request: {
                auth: ({ expires, aud, pca, ...message }: WithExtraOptions<ExclusivePartial<IAuthenticationAttrs, "callbackURL">>, pass: string) => Promise<JSONWebToken<any>>;
                offer: ({ expires, aud, pca, ...message }: WithExtraOptions<CredentialOfferRequestAttrs>, pass: string) => Promise<JSONWebToken<any>>;
                share: ({ expires, aud, pca, ...message }: WithExtraOptions<ICredentialRequestAttrs>, pass: string) => Promise<JSONWebToken<any>>;
            };
            response: {
                auth: ({ expires, aud, pca, ...message }: WithExtraOptions<ExclusivePartial<IAuthenticationAttrs, "callbackURL">>, pass: string, recieved?: JSONWebToken<Authentication>) => Promise<JSONWebToken<any>>;
                offer: ({ expires, aud, pca, ...message }: WithExtraOptions<CredentialOfferResponseAttrs>, pass: string, recieved?: JSONWebToken<CredentialOfferRequest>) => Promise<JSONWebToken<any>>;
                share: ({ expires, aud, pca, ...message }: WithExtraOptions<ICredentialResponseAttrs>, pass: string, recieved?: JSONWebToken<CredentialRequest>) => Promise<JSONWebToken<any>>;
                issue: ({ expires, aud, pca, ...message }: WithExtraOptions<ICredentialsReceiveAttrs>, pass: string, recieved?: JSONWebToken<CredentialOfferResponse>) => Promise<JSONWebToken<any>>;
            };
        };
    };
}
export {};
