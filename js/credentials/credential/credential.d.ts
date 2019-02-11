import { ICredentialAttrs, IClaimSection } from './types';
import { BaseMetadata, ContextEntry } from 'cred-types-jolocom-core';
import { ISignedCredCreationArgs } from '../signedCredential/types';
export declare class Credential {
    private '_@context';
    private _id;
    private _type;
    private _claim;
    private _name;
    id: string;
    claim: IClaimSection;
    type: string[];
    name: string;
    context: ContextEntry[];
    static create<T extends BaseMetadata>({ metadata, claim, subject }: ISignedCredCreationArgs<T>): Credential;
    static fromJSON(json: ICredentialAttrs): Credential;
    toJSON(): ICredentialAttrs;
}
