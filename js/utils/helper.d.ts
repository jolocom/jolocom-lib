/// <reference types="node" />
import { Identity } from '../identity/identity';
import { IVaultedKeyProvider } from '@jolocom/vaulted-key-provider';
import { IKeyMetadata } from '../identityWallet/types';
export declare function keyIdToDid(keyId: string): string;
export declare function fuelKeyWithEther(publicKey: Buffer): any;
export declare const publicKeyToAddress: (publicKey: Buffer) => string;
export declare const mapPublicKeys: (identity: Identity, vkp: IVaultedKeyProvider, pass: string) => Promise<IKeyMetadata>;
