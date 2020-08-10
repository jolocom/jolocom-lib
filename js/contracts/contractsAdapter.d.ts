import { IContractsAdapter, ITransactionEncodable } from './types';
export declare class ContractsAdapter implements IContractsAdapter {
    private readonly chainId;
    constructor(chainId?: number);
    assembleTxFromInteractionToken({ transactionOptions }: ITransactionEncodable, from: string, nonce: number, vault: any, password: string): string;
}
export declare const jolocomContractsAdapter: ContractsAdapter;
