import { IdentityWallet } from '../identityWallet/identityWallet';
import { IKeyRefArgs } from '@jolocom/vaulted-key-provider';
declare function recoverFromSeedPhrase(resolver: import("../didMethods/types").IResolver, mnemonicPhrase: string, keyMetaData: IKeyRefArgs): Promise<IdentityWallet>;
declare function recoverFromShards(resolver: import("../didMethods/types").IResolver, shards: string[], keyMetaData: IKeyRefArgs): Promise<IdentityWallet>;
export { recoverFromSeedPhrase, recoverFromShards };
