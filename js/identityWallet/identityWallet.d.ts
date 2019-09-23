import { BaseMetadata } from 'cred-types-jolocom-core';
import { Credential } from '../credentials/credential/credential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { ExclusivePartial, IIdentityWalletCreateArgs } from './types';
import { Identity } from '../identity/identity';
import { JSONWebToken, JWTEncodable } from '../interactionTokens/JSONWebToken';
import { PaymentRequest } from '../interactionTokens/paymentRequest';
import { CredentialRequest } from '../interactionTokens/credentialRequest';
import { KeyTypes } from '../vaultedKeyProvider/types';
import { IKeyMetadata, ISignedCredCreationArgs } from '../credentials/signedCredential/types';
import { ITransactionEncodable } from '../contracts/types';
import { IRegistry } from '../registries/types';
import { CredentialOfferRequest } from '../interactionTokens/credentialOfferRequest';
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
    private createAuth;
    private createCredOfferRequest;
    private createCredentialOfferResponse;
    private createCredReq;
    private createCredResp;
    private createCredReceive;
    getPublicKeys: (encryptionPass: string) => PublicKeyMap;
    private createPaymentReq;
    private createPaymentResp;
    private initializeAndSign;
    validateJWT<T extends JWTEncodable, A extends JWTEncodable>(receivedJWT: JSONWebToken<T>, sendJWT?: JSONWebToken<A>, customRegistry?: IRegistry): Promise<void>;
    private sendTransaction;
    transactions: {
        sendTransaction: (request: ITransactionEncodable, pass: string) => Promise<string>;
    };
    create: {
        credential: typeof Credential.create;
        signedCredential: <T extends BaseMetadata>(params: ISignedCredCreationArgs<T>, pass: string) => Promise<SignedCredential>;
        interactionTokens: {
            request: {
                auth: (authArgs: WithExtraOptions<ExclusivePartial<IAuthenticationAttrs, "callbackURL">>, pass: string, receivedJWT?: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
                offer: (credOffer: WithExtraOptions<CredentialOfferRequestAttrs>, pass: string) => Promise<JSONWebToken<CredentialOfferRequest>>;
                share: (credReq: WithExtraOptions<ICredentialRequestAttrs>, pass: string) => Promise<JSONWebToken<CredentialRequest>>;
                payment: (paymentReq: WithExtraOptions<PaymentRequestCreationArgs>, pass: string) => Promise<JSONWebToken<PaymentRequest>>;
            };
            response: {
                auth: (authArgs: WithExtraOptions<ExclusivePartial<IAuthenticationAttrs, "callbackURL">>, pass: string, receivedJWT?: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
                offer: (credentialOfferResponse: WithExtraOptions<CredentialOfferResponseAttrs>, pass: string, receivedJWT?: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
                share: (credResp: WithExtraOptions<ICredentialResponseAttrs>, pass: string, receivedJWT: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
                issue: (credReceive: WithExtraOptions<ICredentialsReceiveAttrs>, pass: string, receivedJWT: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
                payment: (paymentResp: WithExtraOptions<IPaymentResponseAttrs>, pass: string, receivedJWT: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
            };
        };
    };
}
export {};
