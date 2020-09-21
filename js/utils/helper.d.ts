/// <reference types="node" />
import { DidDocument } from '../identity/didDocument/didDocument';
import { PublicKeyInfo } from '@jolocom/vaulted-key-provider';
import { IKeyMetadata } from '../identityWallet/types';
export declare function keyIdToDid(keyId: string): string;
export declare function fuelKeyWithEther(publicKey: Buffer): any;
export declare const publicKeyToAddress: (publicKey: Buffer) => string;
export declare const mapPublicKeys: (didDocument: DidDocument, vkpKeys: PublicKeyInfo[]) => IKeyMetadata;
