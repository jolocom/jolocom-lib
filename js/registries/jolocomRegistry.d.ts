import { IIpfsConnector } from '../ipfs/types';
import { IEthereumConnector } from '../ethereum/types';
import { IdentityWallet } from '../identityWallet/identityWallet';
import { Identity } from '../identity/identity';
import { IRegistryCommitArgs, IRegistryStaticCreationArgs, IRegistry } from './types';
import { IVaultedKeyProvider, IKeyDerivationArgs } from '../vaultedKeyProvider/types';
import { IContractsAdapter, IContractsGateway } from '../contracts/types';
import { Resolver } from 'did-resolver';
export declare class JolocomRegistry implements IRegistry {
    ipfsConnector: IIpfsConnector;
    ethereumConnector: IEthereumConnector;
    contractsAdapter: IContractsAdapter;
    contractsGateway: IContractsGateway;
    resolver: Resolver;
    create(vaultedKeyProvider: IVaultedKeyProvider, decryptionPassword: string): Promise<IdentityWallet>;
    commit(commitArgs: IRegistryCommitArgs): Promise<void>;
    resolve(did: string): Promise<Identity>;
    authenticate(vaultedKeyProvider: IVaultedKeyProvider, derivationArgs: IKeyDerivationArgs, did?: string): Promise<IdentityWallet>;
    private resolveSafe;
}
export declare const jolocomResolver: () => Resolver;
export declare const createJolocomRegistry: (configuration?: Partial<IRegistryStaticCreationArgs>) => JolocomRegistry;
