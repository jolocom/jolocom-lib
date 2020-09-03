import { Identity } from '../identity/identity';
import { IVaultedKeyProvider, KeyTypes } from '@jolocom/vaulted-key-provider';
export interface IIdentityWalletCreateArgs {
    vaultedKeyProvider: IVaultedKeyProvider;
    identity: Identity;
    publicKeyMetadata: IKeyMetadata;
}
export declare type ExclusivePartial<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>;
declare type PubKeyEntry = {
    keyId: string;
    type: KeyTypes;
};
export interface IKeyMetadata {
    signingKey: PubKeyEntry;
    encryptionKey: PubKeyEntry;
    [key: string]: PubKeyEntry;
}
export {};
