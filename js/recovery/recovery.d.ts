import { IdentityWallet } from '../identityWallet/identityWallet';
import { IKeyDerivationArgs } from '../vaultedKeyProvider/types';
declare function recoverFromSeedPhrase(resolver: import("../didMethods/types").Resolver, mnemonicPhrase: string, keyMetaData: IKeyDerivationArgs): Promise<IdentityWallet>;
declare function recoverFromShards(resolver: import("../didMethods/types").Resolver, shards: string[], keyMetaData: IKeyDerivationArgs): Promise<IdentityWallet>;
export { recoverFromSeedPhrase, recoverFromShards };
