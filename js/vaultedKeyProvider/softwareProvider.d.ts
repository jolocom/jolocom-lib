/// <reference types="node" />
import { IDigestable } from '../linkedDataSignature/types';
import { IVaultedKeyProvider, IKeyDerivationArgs } from './types';
export declare class SoftwareKeyProvider implements IVaultedKeyProvider {
    private readonly encryptedSeed;
    constructor(seed: Buffer, encryptionPass: string);
    getPublicKey(derivationArgs: IKeyDerivationArgs): Buffer;
    static getRandom(nr: any): Buffer;
    sign(derivationArgs: IKeyDerivationArgs, digest: Buffer): Buffer;
    static verify(digest: Buffer, publicKey: Buffer, signature: Buffer): boolean;
    getPrivateKey(derivationArgs: IKeyDerivationArgs): any;
    signDigestable(derivationArgs: IKeyDerivationArgs, toSign: IDigestable): Promise<Buffer>;
    static verifyDigestable(publicKey: Buffer, toVerify: IDigestable): Promise<boolean>;
    private encrypt;
    private decrypt;
}
