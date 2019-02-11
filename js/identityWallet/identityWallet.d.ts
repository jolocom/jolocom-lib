/// <reference types="node" />
import { BaseMetadata } from 'cred-types-jolocom-core';
import { Credential } from '../credentials/credential/credential';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { IIdentityWalletCreateArgs } from './types';
import { Identity } from '../identity/identity';
import { JSONWebToken, JWTEncodable } from '../interactionTokens/JSONWebToken';
import { CredentialRequest } from '../interactionTokens/credentialRequest';
import { PaymentRequest } from '../interactionTokens/paymentRequest';
import { IKeyMetadata, ISignedCredCreationArgs } from '../credentials/signedCredential/types';
import { JolocomRegistry } from '../registries/jolocomRegistry';
import { ICredentialResponseAttrs, ICredentialRequestAttrs, ICredentialOfferAttrs, IAuthenticationAttrs, ICredentialsReceiveAttrs, IPaymentRequestAttrs, IPaymentResponseAttrs } from '../interactionTokens/interactionTokens.types';
import { IKeyDerivationArgs } from '../vaultedKeyProvider/types';
export declare class IdentityWallet {
    private _identity;
    private _publicKeyMetadata;
    private _vaultedKeyProvider;
    getPublicKey(keyDerivarionArgs: IKeyDerivationArgs): Buffer;
    did: string;
    identity: Identity;
    didDocument: import("../identity/didDocument/didDocument").DidDocument;
    publicKeyMetadata: IKeyMetadata;
    private vaultedKeyProvider;
    constructor({ identity, publicKeyMetadata, vaultedKeyProvider }: IIdentityWalletCreateArgs);
    private createSignedCred;
    private createAuth;
    private createCredOffer;
    private createCredReq;
    private createCredResp;
    private createCredReceive;
    private createPaymentReq;
    private createPaymentResp;
    private initializeAndSign;
    validateJWT<T extends JWTEncodable, A extends JWTEncodable>(receivedJWT: JSONWebToken<T>, sendJWT?: JSONWebToken<A>, customRegistry?: JolocomRegistry): Promise<void>;
    create: {
        credential: typeof Credential.create;
        signedCredential: <T extends BaseMetadata>(params: ISignedCredCreationArgs<T>, pass: string) => Promise<SignedCredential>;
        interactionTokens: {
            request: {
                auth: (authArgs: IAuthenticationAttrs, pass: string, receivedJWT?: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
                offer: (credOffer: ICredentialOfferAttrs, pass: string, receivedJWT?: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
                share: (credReq: ICredentialRequestAttrs, pass: string) => Promise<JSONWebToken<CredentialRequest>>;
                payment: (paymentReq: IPaymentRequestAttrs, pass: string) => Promise<JSONWebToken<PaymentRequest>>;
            };
            response: {
                auth: (authArgs: IAuthenticationAttrs, pass: string, receivedJWT?: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
                offer: (credOffer: ICredentialOfferAttrs, pass: string, receivedJWT?: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
                share: (credResp: ICredentialResponseAttrs, pass: string, receivedJWT: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
                issue: (credReceive: ICredentialsReceiveAttrs, pass: string, receivedJWT: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
                payment: (paymentResp: IPaymentResponseAttrs, pass: string, receivedJWT: JSONWebToken<JWTEncodable>) => Promise<JSONWebToken<JWTEncodable>>;
            };
        };
    };
}
