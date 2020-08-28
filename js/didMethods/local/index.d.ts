/// <reference types="node" />
import { IDidMethod, IResolver, IRegistrar } from '../types';
import { InternalDb } from 'local-resolver-registrar/js/db';
export declare class LocalDidMethod implements IDidMethod {
    prefix: string;
    resolver: IResolver;
    registrar: IRegistrar;
    private db;
    constructor(db?: InternalDb);
    recoverFromSeed(seed: Buffer, newPassword: string): Promise<import("../../identityWallet/identityWallet").IdentityWallet>;
}
