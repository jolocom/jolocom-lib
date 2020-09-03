/// <reference types="node" />
import { PublicKeyInfo } from '@jolocom/vaulted-key-provider';
import { IKeyMetadata } from '../identityWallet/types';
import { DidDocument } from '../identity/didDocument/didDocument';
export declare function keyIdToDid(keyId: string): string;
export declare function fuelKeyWithEther(publicKey: Buffer): any;
export declare const publicKeyToAddress: (publicKey: Buffer) => string;
export declare const mapPublicKeys: (didDocument: DidDocument, vkpKeys: PublicKeyInfo[]) => IKeyMetadata;
