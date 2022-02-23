/// <reference types="node" />
import { IDidMethod, IResolver, IRegistrar } from '../types';
import { InternalDb } from '@jolocom/local-resolver-registrar/js/db';
export declare class LocalDidMethod implements IDidMethod {
    prefix: string;
    resolver: IResolver;
    registrar: IRegistrar;
    private db;
    constructor(db?: InternalDb);
    recoverFromSeed(seed: Buffer, newPassword: string): Promise<{
        identityWallet: import("../..").IdentityWallet;
        succesfullyResolved: boolean;
    }>;
}
