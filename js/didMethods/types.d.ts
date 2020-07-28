import { IVaultedKeyProvider } from "@jolocom/protocol-ts/dist/lib/vaultedKeyProvider";
import { Identity } from "../identity/identity";
export interface Registrar {
    prefix: string;
    encounter: <T>(change: T) => Promise<boolean>;
    create: <T>(keyProvider: IVaultedKeyProvider, password: string, creationConfig?: T) => Promise<Identity>;
    updatePublicProfile: (keyProvider: IVaultedKeyProvider, password: string, identity: Identity, publicProfile: any) => Promise<boolean>;
}
export interface Resolver {
    prefix: string;
    resolve: (did: string) => Promise<Identity>;
}
export interface IDidMethod {
    prefix: string;
    resolver: Resolver;
    registrar: Registrar;
}
