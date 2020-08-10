import { IDidMethod, IResolver, IRegistrar } from '../types';
import { IdentityWallet } from '../../identityWallet/identityWallet';
import { InternalDb } from 'local-did-resolver/js/db';
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider';
export declare class LocalDidMethod implements IDidMethod {
    prefix: 'un';
    resolver: IResolver;
    registrar: IRegistrar;
    private db;
    constructor(db?: InternalDb);
    create(vaultedKeyProvider: SoftwareKeyProvider, decryptionPassword: string): Promise<IdentityWallet>;
    authenticate(vaultedKeyProvider: SoftwareKeyProvider, decryptionPassword: string): Promise<IdentityWallet>;
}
