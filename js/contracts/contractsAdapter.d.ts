import { IContractsAdapter, ITransactionEncodable } from './types';
import { IVaultedKeyProvider } from '../vaultedKeyProvider/types';
export declare class ContractsAdapter implements IContractsAdapter {
    private readonly chainId;
    constructor(chainId?: number);
    assembleTxFromInteractionToken({ transactionOptions }: ITransactionEncodable, from: string, nonce: number, vault: IVaultedKeyProvider, password: string): string;
}
export declare const jolocomContractsAdapter: ContractsAdapter;
