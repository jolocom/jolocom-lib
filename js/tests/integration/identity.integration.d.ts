import { IdentityWallet } from '../../ts/identityWallet/identityWallet';
import { IDidMethod } from '../../ts/didMethods/types';
import { SoftwareKeyProvider } from '@jolocom/vaulted-key-provider';
export declare let localDidMethod: IDidMethod;
export declare let userIdentityWallet: IdentityWallet;
export declare let serviceIdentityWallet: IdentityWallet;
export declare let userVault: SoftwareKeyProvider;
export declare let serviceVault: SoftwareKeyProvider;
