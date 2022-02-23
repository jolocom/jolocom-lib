import { IdentityWallet } from '../../identityWallet/identityWallet';
import { SignedCredential } from './signedCredential';
import { Identity } from '../../identity/identity';
export declare class CredentialVerifier {
    private signerIdentities;
    constructor(signers: IdentityWallet[]);
    verifyProofAtIndex(credential: SignedCredential, index: number): Promise<boolean>;
    verifyProofs(credential: SignedCredential): Promise<boolean>;
    addSignerIdentity(signer: Identity): void;
    generateVerificationReport(credential: SignedCredential): Promise<any>;
    private verLoop;
}
