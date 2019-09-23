import { Identity } from '../identity/identity';
import { IVaultedKeyProvider } from '../vaultedKeyProvider/types';
import { IKeyMetadata } from '../credentials/signedCredential/types';
import { IContractsAdapter, IContractsGateway } from '../contracts/types';
export interface IIdentityWalletCreateArgs {
    vaultedKeyProvider: IVaultedKeyProvider;
    identity: Identity;
    publicKeyMetadata: IKeyMetadata;
    contractsAdapter: IContractsAdapter;
    contractsGateway: IContractsGateway;
}
export declare type ExclusivePartial<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>;
