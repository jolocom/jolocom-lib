/// <reference types="node" />
import { EncryptedWalletUtils } from '@jolocom/vaulted-key-provider';
import { Identity } from '../../identity/identity';
import { IRegistrar } from '../types';
export declare const slip10DeriveKey: (seed: Buffer) => (path: String) => Buffer;
export declare const recoverIdentityFromSlip0010Seed: (seed: Buffer, newPassword: string, impl: EncryptedWalletUtils, registrar?: IRegistrar) => Promise<Identity>;
