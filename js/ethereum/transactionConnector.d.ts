/// <reference types="node" />
import { ICreateEthTransactionAttrs } from './types';
export declare class EthereumTransactionConnector {
    private provider;
    constructor(providerUri: string);
    createTransaction(args: ICreateEthTransactionAttrs): Promise<any>;
    sendSignedTransaction(serializedTx: Buffer): Promise<any>;
}
export declare const jolocomEthTransactionConnector: EthereumTransactionConnector;
