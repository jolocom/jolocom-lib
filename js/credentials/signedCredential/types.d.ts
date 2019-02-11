import { ICredentialAttrs, IClaimSection } from '../credential/types';
import { ILinkedDataSignatureAttrs } from '../../linkedDataSignature/types';
import { BaseMetadata } from 'cred-types-jolocom-core';
export interface ISignedCredentialAttrs extends ICredentialAttrs {
    id: string;
    issuer: string;
    issued: string;
    expires?: string;
    claim: IClaimSection;
    proof: ILinkedDataSignatureAttrs;
}
export interface ISignedCredCreationArgs<T extends BaseMetadata> {
    metadata: T;
    claim: T['claimInterface'];
    subject: string;
}
export interface IKeyMetadata {
    derivationPath: string;
    keyId: string;
}
