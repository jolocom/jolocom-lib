/// <reference types="node" />
export declare function sha256(data: Buffer): Buffer;
export declare function publicKeyToDID(publicKey: Buffer): string;
export declare function getRandomBytes(nr: number): Promise<Buffer>;
