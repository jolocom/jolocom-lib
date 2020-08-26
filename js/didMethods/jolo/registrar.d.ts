/// <reference types="node" />
import { Identity } from '../../identity/identity';
import { getRegistrar } from '@jolocom/jolo-did-registrar';
import { SignedCredential } from '../../credentials/signedCredential/signedCredential';
import { IRegistrar } from '../types';
import { SoftwareKeyProvider, EncryptedWalletUtils } from '@jolocom/vaulted-key-provider';
export declare const joloSeedToEncryptedWallet: (seed: Buffer, newPassword: string, impl: EncryptedWalletUtils, originalDid?: string) => Promise<SoftwareKeyProvider>;
export declare class JolocomRegistrar implements IRegistrar {
    prefix: string;
    registrarFns: ReturnType<typeof getRegistrar>;
    constructor(providerUrl?: string, contractAddress?: string, ipfsHost?: string);
    create(keyProvider: SoftwareKeyProvider, password: string): Promise<Identity>;
    updatePublicProfile(keyProvider: SoftwareKeyProvider, password: string, identity: Identity, publicProfile: SignedCredential): Promise<boolean>;
    encounter(): Promise<Identity>;
    private signDidDocument;
    private update;
}
