import { Identity } from '../../identity/identity';
import { SignedCredential } from '../../credentials/signedCredential/signedCredential';
import { IRegistrar } from '../types';
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider';
export declare class LocalRegistrar implements IRegistrar {
    prefix: string;
    private registrar;
    constructor(db?: import("local-did-resolver/js").InternalDb);
    create(keyProvider: SoftwareKeyProvider, password: string): Promise<Identity>;
    updatePublicProfile(keyProvider: SoftwareKeyProvider, password: string, identity: Identity, publicProfile: SignedCredential): Promise<boolean>;
    encounter(delta: string[]): Promise<boolean>;
}
