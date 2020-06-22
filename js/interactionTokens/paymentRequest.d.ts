import { IPaymentRequestAttrs } from './interactionTokens.types';
import { ITransactionEncodable, TransactionOptions } from '../contracts/types';
export declare class PaymentRequest implements ITransactionEncodable {
    private _callbackURL;
    private _transactionOptions;
    private _description;
    transactionOptions: TransactionOptions;
    description: string;
    callbackURL: string;
    toJSON(): IPaymentRequestAttrs;
    static fromJSON(json: IPaymentRequestAttrs): PaymentRequest;
}
