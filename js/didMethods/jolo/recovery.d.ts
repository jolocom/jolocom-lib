/// <reference types="node" />
import { EncryptedWalletUtils, SoftwareKeyProvider } from '@jolocom/vaulted-key-provider';
export declare const recoverJoloKeyProviderFromSeed: (seed: Buffer, newPassword: string, impl: EncryptedWalletUtils, originalDid?: string) => Promise<SoftwareKeyProvider>;
