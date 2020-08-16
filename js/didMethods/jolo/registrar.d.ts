/// <reference types="node" />
import { Identity } from '../../identity/identity';
import { getRegistry } from 'jolo-did-registry';
import { SignedCredential } from '../../credentials/signedCredential/signedCredential';
import { IRegistrar } from '../types';
import { SoftwareKeyProvider, EncryptedWalletUtils } from '@jolocom/vaulted-key-provider';
export declare const joloSeedToEncryptedWallet: (seed: Buffer, newPassword: string, impl: EncryptedWalletUtils) => Promise<SoftwareKeyProvider>;
export declare class JolocomRegistrar implements IRegistrar {
    prefix: string;
    registry: ReturnType<typeof getRegistry>;
    constructor(providerUrl?: string, contractAddress?: string, ipfsHost?: string);
    create(keyProvider: SoftwareKeyProvider, password: string): Promise<Identity>;
    updatePublicProfile(keyProvider: SoftwareKeyProvider, password: string, identity: Identity, publicProfile: SignedCredential): Promise<boolean>;
    encounter(): Promise<Identity>;
    private signDidDocument;
    private update;
}
