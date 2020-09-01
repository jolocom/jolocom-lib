/// <reference types="node" />
import { IDidMethod } from '../types';
import { JolocomResolver } from './resolver';
import { JolocomRegistrar } from './registrar';
export declare class JoloDidMethod implements IDidMethod {
    prefix: string;
    resolver: JolocomResolver;
    registrar: JolocomRegistrar;
    constructor(providerUrl?: string, contractAddress?: string, ipfsHost?: string);
    recoverFromSeed(seed: Buffer, newPassword: string): Promise<{
        identityWallet: import("../../identityWallet/identityWallet").IdentityWallet;
        succesfullyResolved: boolean;
    }>;
}
