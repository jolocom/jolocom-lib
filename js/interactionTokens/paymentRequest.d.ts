import { IPaymentRequestAttrs, ITransactionDetailsPaymentRequest } from './interactionTokens.types';
export declare class PaymentRequest {
    private _callbackURL;
    private _transactionDetails;
    private _description;
    transactionDetails: ITransactionDetailsPaymentRequest;
    description: string;
    callbackURL: string;
    toJSON(): IPaymentRequestAttrs;
    static fromJSON(json: IPaymentRequestAttrs): PaymentRequest;
}
