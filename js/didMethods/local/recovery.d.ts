/// <reference types="node" />
import { SoftwareKeyProvider, EncryptedWalletUtils } from '@jolocom/vaulted-key-provider';
import { IDidMethod } from '../types';
export declare const slip10DeriveKey: (seed: Buffer) => (path: String) => Buffer;
export declare const recoverJunKeyProviderFromSeed: (seed: Buffer, newPassword: string, impl: EncryptedWalletUtils) => Promise<{
    keyProvider: SoftwareKeyProvider;
    inceptionEvent: string[];
}>;
export declare const junMnemonicToEncryptedWallet: (mnemonicPhrase: string, newPassword: string, didMethod: IDidMethod, impl: EncryptedWalletUtils) => Promise<import("../../identityWallet/identityWallet").IdentityWallet>;
