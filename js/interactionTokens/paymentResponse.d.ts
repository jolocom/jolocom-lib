import { IPaymentResponseAttrs } from './interactionTokens.types';
export declare class PaymentResponse {
    private _txHash;
    txHash: string;
    toJSON(): IPaymentResponseAttrs;
    static fromJSON(json: IPaymentResponseAttrs): PaymentResponse;
}
