import { Identity } from '../identity/identity';
import { IVaultedKeyProvider } from '@jolocom/vaulted-key-provider';
export interface IIdentityWalletCreateArgs {
    vaultedKeyProvider: IVaultedKeyProvider;
    identity: Identity;
    publicKeyMetadata: IKeyMetadata;
}
export declare type ExclusivePartial<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>;
export interface IKeyMetadata {
    signingKeyId: string;
    encryptionKeyId: string;
    [key: string]: string;
}
