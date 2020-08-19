import { Identity } from '../identity/identity';
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider';
export interface IRegistrar {
    prefix: string;
    encounter: (changes: string[]) => Promise<boolean>;
    create: <T>(keyProvider: SoftwareKeyProvider, password: string, creationConfig?: T) => Promise<Identity>;
    updatePublicProfile: (keyProvider: SoftwareKeyProvider, password: string, identity: Identity, publicProfile: any) => Promise<boolean>;
}
export interface IResolver {
    prefix: string;
    resolve: (did: string) => Promise<Identity>;
}
export interface IDidMethod {
    prefix: string;
    resolver: IResolver;
    registrar: IRegistrar;
}
