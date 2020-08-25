import { Identity } from '../../identity/identity';
import { SignedCredential } from '../../credentials/signedCredential/signedCredential';
import { IRegistrar } from '../types';
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider';
export declare class LocalRegistrar implements IRegistrar {
    prefix: string;
    private registrar;
    constructor(db?: import("local-resolver-registrar/js/db").InternalDb);
    create(keyProvider: SoftwareKeyProvider, password: string): Promise<Identity>;
    updatePublicProfile(keyProvider: SoftwareKeyProvider, password: string, identity: Identity, publicProfile: SignedCredential): Promise<boolean>;
    encounter(deltas: string[]): Promise<Identity>;
}
