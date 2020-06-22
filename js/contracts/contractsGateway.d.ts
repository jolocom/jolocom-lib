import { Web3Provider } from 'ethers/providers';
import { IContractsGateway } from './types';
export declare class ContractsGateway implements IContractsGateway {
    private provider;
    constructor(provider: string | Web3Provider);
    getAddressInfo(address: string): Promise<{
        balance: number;
        nonce: number;
    }>;
    getNetworkInfo(): {
        name?: undefined;
        chainId?: undefined;
        endpoint?: undefined;
    } | {
        name: string;
        chainId: number;
        endpoint: string;
    };
    broadcastTransaction(serializedTx: string): Promise<string>;
}
export declare const jolocomContractsGateway: ContractsGateway;
