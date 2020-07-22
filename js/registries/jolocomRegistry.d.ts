import { IdentityWallet } from '../identityWallet/identityWallet';
import { Identity } from '../identity/identity';
import { IRegistry } from './types';
import { IVaultedKeyProvider } from '../vaultedKeyProvider/types';
import { Resolver } from 'did-resolver';
import { Registrar } from '../registrars/types';
export declare class JolocomRegistry implements IRegistry {
    resolver: Resolver;
    registrar: Registrar<Identity, {}>;
    constructor(providerUrl?: string, contractAddress?: string, ipfsHost?: string);
    create(vaultedKeyProvider: IVaultedKeyProvider, decryptionPassword: string): Promise<IdentityWallet>;
    resolve(did: string): Promise<Identity>;
    authenticate(vaultedKeyProvider: IVaultedKeyProvider, password: string): Promise<IdentityWallet>;
}
export declare const jolocomResolver: () => Resolver;
export declare const jolocomRegistry: JolocomRegistry;
