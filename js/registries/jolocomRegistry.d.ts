import { IIpfsConnector } from '../ipfs/types';
import { IEthereumConnector } from '../ethereum/types';
import { IdentityWallet } from '../identityWallet/identityWallet';
import { SignedCredential } from '../credentials/signedCredential/signedCredential';
import { Identity } from '../identity/identity';
import { IRegistryCommitArgs, IRegistryStaticCreationArgs, IRegistry } from './types';
import { IVaultedKeyProvider, IKeyDerivationArgs } from '../vaultedKeyProvider/types';
import { IContractsAdapter, IContractsGateway } from '../contracts/types';
export declare class JolocomRegistry implements IRegistry {
    ipfsConnector: IIpfsConnector;
    ethereumConnector: IEthereumConnector;
    contractsAdapter: IContractsAdapter;
    contractsGateway: IContractsGateway;
    create(vaultedKeyProvider: IVaultedKeyProvider, decryptionPassword: string): Promise<IdentityWallet>;
    commit(commitArgs: IRegistryCommitArgs): Promise<void>;
    resolve(did: any): Promise<Identity>;
    authenticate(vaultedKeyProvider: IVaultedKeyProvider, derivationArgs: IKeyDerivationArgs, did?: string): Promise<IdentityWallet>;
    fetchPublicProfile(entry: string): Promise<SignedCredential>;
    private resolveSafe;
}
export declare const createJolocomRegistry: (configuration?: IRegistryStaticCreationArgs) => JolocomRegistry;
