import { BaseMetadata } from 'cred-types-jolocom-core';
import { Credential } from '../credentials/credential/credential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { ExclusivePartial, IIdentityWalletCreateArgs } from './types';
import { Identity } from '../identity/identity';
import { JSONWebToken } from '../interactionTokens/JSONWebToken';
import { PaymentRequest } from '../interactionTokens/paymentRequest';
import { Authentication } from '../interactionTokens/authentication';
import { CredentialRequest } from '../interactionTokens/credentialRequest';
import { KeyTypes } from '../vaultedKeyProvider/types';
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
    getPublicKeys: (encryptionPass: string) => PublicKeyMap;
    private initializeAndSign;
    validateJWT<T, R>(receivedJWT: JSONWebToken<T>, sendJWT?: JSONWebToken<R>, customRegistry?: IRegistry): Promise<void>;
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
            target?: string;
        }, pass: string, recieved?: JSONWebToken<R>) => Promise<JSONWebToken<T_1>>;
        interactionTokens: {
            request: {
                auth: ({ expires, ...args }: WithExtraOptions<ExclusivePartial<IAuthenticationAttrs, "callbackURL">>, pass: string) => Promise<JSONWebToken<Pick<WithExtraOptions<ExclusivePartial<IAuthenticationAttrs, "callbackURL">>, "description" | "callbackURL">>>;
                offer: ({ expires, ...args }: WithExtraOptions<CredentialOfferRequestAttrs>, pass: string) => Promise<JSONWebToken<Pick<WithExtraOptions<CredentialOfferRequestAttrs>, "callbackURL" | "offeredCredentials">>>;
                share: ({ expires, ...args }: WithExtraOptions<ICredentialRequestAttrs>, pass: string) => Promise<JSONWebToken<Pick<WithExtraOptions<ICredentialRequestAttrs>, "callbackURL" | "credentialRequirements">>>;
                payment: ({ expires, ...args }: WithExtraOptions<PaymentRequestCreationArgs>, pass: string) => Promise<JSONWebToken<Pick<WithExtraOptions<PaymentRequestCreationArgs>, "description" | "transactionOptions" | "callbackURL">>>;
            };
            response: {
                auth: ({ expires, ...args }: WithExtraOptions<ExclusivePartial<IAuthenticationAttrs, "callbackURL">>, pass: string, recieved?: JSONWebToken<Authentication>) => Promise<JSONWebToken<Pick<WithExtraOptions<ExclusivePartial<IAuthenticationAttrs, "callbackURL">>, "description" | "callbackURL">>>;
                offer: ({ expires, ...args }: WithExtraOptions<CredentialOfferResponseAttrs>, pass: string, recieved?: JSONWebToken<CredentialOfferRequest>) => Promise<JSONWebToken<Pick<WithExtraOptions<CredentialOfferResponseAttrs>, "callbackURL" | "selectedCredentials">>>;
                share: ({ expires, ...args }: WithExtraOptions<ICredentialResponseAttrs>, pass: string, recieved?: JSONWebToken<CredentialRequest>) => Promise<JSONWebToken<Pick<WithExtraOptions<ICredentialResponseAttrs>, "callbackURL" | "suppliedCredentials">>>;
                issue: ({ expires, ...args }: WithExtraOptions<ICredentialsReceiveAttrs>, pass: string, recieved?: JSONWebToken<CredentialOfferResponse>) => Promise<JSONWebToken<Pick<WithExtraOptions<ICredentialsReceiveAttrs>, "signedCredentials">>>;
                payment: ({ expires, ...args }: WithExtraOptions<IPaymentResponseAttrs>, pass: string, recieved?: JSONWebToken<PaymentRequest>) => Promise<JSONWebToken<Pick<WithExtraOptions<IPaymentResponseAttrs>, "txHash">>>;
            };
        };
    };
}
export {};
