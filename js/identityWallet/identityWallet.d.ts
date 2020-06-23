/// <reference types="node" />
import { BaseMetadata } from 'cred-types-jolocom-core';
import { Credential } from '../credentials/credential/credential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { ExclusivePartial, IIdentityWalletCreateArgs } from './types';
import { Identity } from '../identity/identity';
import { JSONWebToken } from '../interactionTokens/JSONWebToken';
import { PaymentRequest } from '../interactionTokens/paymentRequest';
import { Authentication } from '../interactionTokens/authentication';
import { CredentialRequest } from '../interactionTokens/credentialRequest';
import { KeyTypes, IKeyDerivationArgs } from '../vaultedKeyProvider/types';
import { IKeyMetadata, ISignedCredCreationArgs } from '../credentials/signedCredential/types';
import { ITransactionEncodable } from '../contracts/types';
import { IRegistry } from '../registries/types';
import { CredentialOfferRequest } from '../interactionTokens/credentialOfferRequest';
import { CredentialOfferResponse } from '../interactionTokens/credentialOfferResponse';
import { CredentialOfferRequestAttrs, CredentialOfferResponseAttrs, IAuthenticationAttrs, ICredentialRequestAttrs, ICredentialResponseAttrs, ICredentialsReceiveAttrs, IPaymentRequestAttrs, IPaymentResponseAttrs } from '../interactionTokens/interactionTokens.types';
interface PaymentRequestCreationArgs {
    callbackURL: string;
    description: string;
    transactionOptions: ExclusivePartial<IPaymentRequestAttrs['transactionOptions'], 'value'>;
}
declare type PublicKeyMap = {
    [key in keyof typeof KeyTypes]?: string;
};
declare type WithExtraOptions<T> = T & {
    expires?: Date;
    aud?: string;
};
export declare class IdentityWallet {
    private _identity;
    private _publicKeyMetadata;
    private _vaultedKeyProvider;
    private _contractsAdapter;
    private _contractsGateway;
    did: string;
    identity: Identity;
    didDocument: import("../identity/didDocument/didDocument").DidDocument;
    publicKeyMetadata: IKeyMetadata;
    private vaultedKeyProvider;
    constructor({ identity, publicKeyMetadata, vaultedKeyProvider, contractsGateway, contractsAdapter, }: IIdentityWalletCreateArgs);
    private createSignedCred;
    private createMessage;
    private makeReq;
    private makeRes;
    private messageCannonicaliser;
    getPublicKeys: (encryptionPass: string) => PublicKeyMap;
    private initializeAndSign;
    validateJWT<T, R>(receivedJWT: JSONWebToken<T>, sentJWT?: JSONWebToken<R>, customRegistry?: IRegistry): Promise<void>;
    asymEncrypt: (data: Buffer, publicKey: Buffer) => Promise<string>;
    asymEncryptToDidKey: (data: Buffer, keyRef: string, customRegistry?: IRegistry) => Promise<string>;
    asymDecrypt: (data: string, decryptionKeyArgs: IKeyDerivationArgs) => Promise<Buffer>;
    sign: (data: Buffer, pass: string) => Buffer;
    private sendTransaction;
    transactions: {
        sendTransaction: (request: ITransactionEncodable, pass: string) => Promise<string>;
    };
    create: {
        credential: typeof Credential.create;
        signedCredential: <T extends BaseMetadata>({ expires, ...credentialParams }: WithExtraOptions<ISignedCredCreationArgs<T>>, pass: string) => Promise<SignedCredential>;
        message: <T_1, R>(args: {
            message: T_1;
            typ: string;
            expires?: Date;
            aud?: string;
        }, pass: string, recieved?: JSONWebToken<R>) => Promise<JSONWebToken<T_1>>;
        interactionTokens: {
            request: {
                auth: ({ expires, aud, ...message }: WithExtraOptions<ExclusivePartial<IAuthenticationAttrs, "callbackURL">>, pass: string) => Promise<JSONWebToken<any>>;
                offer: ({ expires, aud, ...message }: WithExtraOptions<CredentialOfferRequestAttrs>, pass: string) => Promise<JSONWebToken<any>>;
                share: ({ expires, aud, ...message }: WithExtraOptions<ICredentialRequestAttrs>, pass: string) => Promise<JSONWebToken<any>>;
                payment: ({ expires, aud, ...message }: WithExtraOptions<PaymentRequestCreationArgs>, pass: string) => Promise<JSONWebToken<any>>;
            };
            response: {
                auth: ({ expires, aud, ...message }: WithExtraOptions<ExclusivePartial<IAuthenticationAttrs, "callbackURL">>, pass: string, recieved?: JSONWebToken<Authentication>) => Promise<JSONWebToken<any>>;
                offer: ({ expires, aud, ...message }: WithExtraOptions<CredentialOfferResponseAttrs>, pass: string, recieved?: JSONWebToken<CredentialOfferRequest>) => Promise<JSONWebToken<any>>;
                share: ({ expires, aud, ...message }: WithExtraOptions<ICredentialResponseAttrs>, pass: string, recieved?: JSONWebToken<CredentialRequest>) => Promise<JSONWebToken<any>>;
                issue: ({ expires, aud, ...message }: WithExtraOptions<ICredentialsReceiveAttrs>, pass: string, recieved?: JSONWebToken<CredentialOfferResponse>) => Promise<JSONWebToken<any>>;
                payment: ({ expires, aud, ...message }: WithExtraOptions<IPaymentResponseAttrs>, pass: string, recieved?: JSONWebToken<PaymentRequest>) => Promise<JSONWebToken<any>>;
            };
        };
    };
}
export {};
