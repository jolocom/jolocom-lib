/// <reference types="node" />
import { EncryptedWalletUtils, SoftwareKeyProvider } from "@jolocom/vaulted-key-provider";
import { IDidMethod } from "../types";
export declare const recoverJoloKeyProviderFromSeed: (seed: Buffer, newPassword: string, impl: EncryptedWalletUtils, originalDid?: string) => Promise<SoftwareKeyProvider>;
export declare const recoverJoloIdwFromMnemonic: (mnemonicPhrase: string, newPassword: string, didMethod: IDidMethod, impl: EncryptedWalletUtils) => Promise<import("../../identityWallet/identityWallet").IdentityWallet>;
