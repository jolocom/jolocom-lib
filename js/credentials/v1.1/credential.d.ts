import { ICredentialAttrs, IClaimSection } from '../types';
import { BaseMetadata } from '@jolocom/protocol-ts';
import { ISignedCredCreationArgs } from '../types';
import { JsonLdContext } from '../../linkedData/types';
import { SignedCredential } from './signedCredential';
export declare class Credential {
    protected '_@context': JsonLdContext;
    protected _id: string;
    protected _type: string[];
    protected _claim: IClaimSection;
    id: string;
    credentialSubject: IClaimSection;
    type: string[];
    context: JsonLdContext;
    static build<T extends BaseMetadata>({ metadata, claim, subject, }: ISignedCredCreationArgs<T>): Credential;
    toVerifiableCredential(): SignedCredential;
    static fromJSON(json: ICredentialAttrs): Credential;
    toJSON(): ICredentialAttrs;
}
