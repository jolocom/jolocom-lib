import { Identity } from '../identity/identity';
import { IVaultedKeyProvider, KeyTypes } from '../vaultedKeyProvider/types';
import { IKeyMetadata } from '../credentials/signedCredential/types';
import { IContractsAdapter, IContractsGateway } from '../contracts/types';
import { CredentialOfferRequestAttrs, CredentialOfferResponseAttrs, ICredentialRequestAttrs, ICredentialResponseAttrs, ICredentialsReceiveAttrs, IPaymentResponseAttrs } from '../interactionTokens/interactionTokens.types';
export interface IIdentityWalletCreateArgs {
    vaultedKeyProvider: IVaultedKeyProvider;
    identity: Identity;
    publicKeyMetadata: IKeyMetadata;
    contractsAdapter: IContractsAdapter;
    contractsGateway: IContractsGateway;
}
export declare type PublicKeyMap = {
    [key in keyof typeof KeyTypes]?: string;
};
export interface AuthCreationArgs {
    callbackURL: string;
    description?: string;
}
export declare type CredentialReceiveCreationArgs = ICredentialsReceiveAttrs;
export declare type CredentialShareRequestCreationArgs = ICredentialRequestAttrs;
export declare type CredentialShareResponseCreationArgs = ICredentialResponseAttrs;
export declare type CredentialOfferRequestCreationArgs = CredentialOfferRequestAttrs;
export declare type CredentialOfferResponseCreationArgs = CredentialOfferResponseAttrs;
export declare type PaymentResponseCreationArgs = IPaymentResponseAttrs;
export interface PaymentRequestCreationArgs {
    callbackURL: string;
    description: string;
    transactionOptions: {
        value: number;
        to?: string;
        gasLimit?: number;
        gasPrice?: number;
    };
}
