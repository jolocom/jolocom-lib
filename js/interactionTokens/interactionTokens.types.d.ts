import { ISignedCredentialAttrs } from '../credentials/signedCredential/types';
export interface ICredentialOfferAttrs {
    callbackURL: string;
    instant: boolean;
    requestedInput: {
        [key: string]: string | null;
    };
}
export interface ICredentialRequestAttrs {
    callbackURL: string;
    credentialRequirements: ICredentialRequest[];
}
export interface ICredentialResponseAttrs {
    callbackURL: string;
    suppliedCredentials: ISignedCredentialAttrs[];
}
export interface ICredentialsReceiveAttrs {
    signedCredentials: ISignedCredentialAttrs[];
}
export interface ICredentialRequest {
    type: string[];
    constraints: IConstraint[];
}
export interface IAuthenticationAttrs {
    callbackURL: string;
}
export declare type Operator = '==' | '!=' | '<' | '>';
export interface IConstraint {
    [operator: string]: boolean[] | Array<{
        var: string;
    } | string | Comparable>;
}
export declare type Comparable = number | Date;
declare type ConstraintFunc = (field: string, value: string) => IConstraint;
declare type ComparableConstraintFunc = (field: string, value: Comparable) => IConstraint;
export interface IExposedConstraintFunctions {
    is: ConstraintFunc;
    not: ConstraintFunc;
    greater: ComparableConstraintFunc;
    smaller: ComparableConstraintFunc;
}
export interface IPaymentRequestAttrs {
    callbackURL: string;
    description: string;
    transactionDetails: ITransactionDetailsPaymentRequest;
}
export interface ITransactionDetailsPaymentRequest {
    receiverAddress: string;
    amountInEther: string;
    senderAddress?: string;
    chainId?: number;
    gasPriceInWei?: string;
    gasLimit?: number;
}
export interface IPaymentResponseAttrs {
    txHash: string;
}
export {};
