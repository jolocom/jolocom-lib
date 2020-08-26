import { EncryptedWalletUtils } from '@jolocom/vaulted-key-provider';
export declare const joloMnemonicToEncryptedWallet: (mnemonicPhrase: string, newPassword: string, impl: EncryptedWalletUtils) => Promise<import("@jolocom/vaulted-key-provider").SoftwareKeyProvider>;
declare const recoverFromSeedPhrase: (mnemonicPhrase: string, newPassword: string, impl: EncryptedWalletUtils, resolver?: import("../didMethods/types").IResolver) => Promise<import("../identityWallet/identityWallet").IdentityWallet>;
declare const recoverFromShards: (shards: string[], newPassword: string, impl: EncryptedWalletUtils, resolver?: import("../didMethods/types").IResolver) => Promise<import("../identityWallet/identityWallet").IdentityWallet>;
export { recoverFromSeedPhrase, recoverFromShards };
