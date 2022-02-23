/// <reference types="node" />
import 'reflect-metadata';
import { ILinkedDataSignatureAttrs, ProofDerivationOptions } from '../types';
import { sha256 } from '../../utils/crypto';
import { IdentityWallet } from '../../identityWallet/identityWallet';
import { JsonLdObject } from '@jolocom/protocol-ts';
import { Identity } from '../../identity/identity';
import { LinkedDataProof, SupportedSuites, BaseProofOptions } from '..';
export declare class Ed25519Signature2018<T extends BaseProofOptions> extends LinkedDataProof<T> {
    private encodedJWTHeader;
    proofType: SupportedSuites;
    signatureSuite: {
        hashFn: typeof sha256;
        normalizeFn: (doc: JsonLdObject) => Promise<any>;
        encodeSignature: (signature: Buffer) => string;
        decodeSignature: (jws: string) => Buffer;
    };
    proofPurpose: string;
    created: Date;
    readonly type: SupportedSuites;
    jws: string;
    verificationMethod: string;
    static create(arg: BaseProofOptions): LinkedDataProof<BaseProofOptions>;
    derive(inputs: ProofDerivationOptions, proofSpecificOptions: {}, signer: IdentityWallet, pass: string): Promise<this>;
    verify(inputs: ProofDerivationOptions, signer: Identity): Promise<boolean>;
    private createVerifyHash;
    static fromJSON(json: ILinkedDataSignatureAttrs): Ed25519Signature2018<BaseProofOptions>;
    toJSON(): ILinkedDataSignatureAttrs;
}
