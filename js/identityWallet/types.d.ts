import { Identity } from '../identity/identity';
import { IKeyMetadata } from '../credentials/signedCredential/types';
import { IVaultedKeyProvider } from '@jolocom/vaulted-key-provider';
export interface IIdentityWalletCreateArgs {
    vaultedKeyProvider: IVaultedKeyProvider;
    identity: Identity;
    publicKeyMetadata: IKeyMetadata;
}
export declare type ExclusivePartial<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>;
