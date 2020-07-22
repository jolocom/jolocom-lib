import { IVaultedKeyProvider } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider";
export interface Registrar<T, U> {
    prefix: string;
    encounter: (change: T) => Promise<boolean>;
    create: (keyProvider: IVaultedKeyProvider, password: string, creationConfig?: U) => Promise<T>;
    updatePublicProfile: (keyProvider: IVaultedKeyProvider, password: string, identity: T, publicProfile: object) => Promise<boolean>;
}
