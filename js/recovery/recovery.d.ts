import { IdentityWallet } from '../identityWallet/identityWallet';
import { IKeyDerivationArgs } from '../vaultedKeyProvider/types';
import { JolocomRegistry } from '../registries/jolocomRegistry';
declare function recoverFromSeedPhrase(registry: JolocomRegistry, mnemonicPhrase: string, keyMetaData: IKeyDerivationArgs): Promise<IdentityWallet>;
declare function recoverFromShards(registry: JolocomRegistry, shards: string[], keyMetaData: IKeyDerivationArgs): Promise<IdentityWallet>;
export { recoverFromSeedPhrase, recoverFromShards };
