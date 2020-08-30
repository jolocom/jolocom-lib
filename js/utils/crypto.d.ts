/// <reference types="node" />
export declare function sha256(data: Buffer): Buffer;
export declare function getRandomBytes(nr: number): Promise<Buffer>;
export { mnemonicToEntropy, entropyToMnemonic } from 'bip39';
