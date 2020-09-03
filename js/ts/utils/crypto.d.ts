/// <reference types="node" />
export declare function sha256(data: Buffer): Buffer;
export declare function getRandomBytes(nr: number): Promise<Buffer>;
export declare const parseHexOrBase64: (hexOrBase64: string) => Buffer;
export { mnemonicToEntropy, entropyToMnemonic } from 'bip39';
