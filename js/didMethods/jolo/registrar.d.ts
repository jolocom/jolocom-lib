import { Identity } from '../../identity/identity';
import { SignedCredential } from '../../credentials/signedCredential/signedCredential';
import { IRegistrar } from '../types';
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider';
export declare class JolocomRegistrar implements IRegistrar {
    prefix: string;
    private registrarFns;
    constructor(providerUrl?: string, contractAddress?: string, ipfsHost?: string);
    create(keyProvider: SoftwareKeyProvider, password: string): Promise<Identity>;
    didDocumentFromKeyProvider(keyProvider: SoftwareKeyProvider, password: string): Promise<Identity>;
    updatePublicProfile(keyProvider: SoftwareKeyProvider, password: string, identity: Identity, publicProfile: SignedCredential): Promise<boolean>;
    encounter(): Promise<Identity>;
    private signDidDocument;
    private update;
}
