/// <reference types="node" />
import { DidDocument } from '../identity/didDocument/didDocument';
export declare function keyIdToDid(keyId: string): string;
export declare function getIssuerPublicKey(keyId: string, ddo: DidDocument): Buffer;
export declare function fuelKeyWithEther(publicKey: Buffer): any;
export declare const publicKeyToAddress: (publicKey: Buffer) => string;
