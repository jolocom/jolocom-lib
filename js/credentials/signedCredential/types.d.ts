import { ICredentialAttrs, IClaimSection } from '../credential/types';
import { BaseMetadata } from 'jolocom-protocol-ts';
import { SignedJsonLdObject } from '../../linkedData/types';
export interface ISignedCredentialAttrs extends SignedJsonLdObject, ICredentialAttrs {
    id: string;
    issuer: string;
    issued: string;
    expires?: string;
    claim: IClaimSection;
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
