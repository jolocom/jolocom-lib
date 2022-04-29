import { ICredentialAttrs, IClaimSection } from './types';
import { BaseMetadata } from '@jolocom/protocol-ts';
import { ISignedCredCreationArgs } from '../signedCredential/types';
import { JsonLdContext } from '../../linkedData/types';
export declare class Credential {
    private '_@context';
    private _id;
    private _type;
    private _claim;
    private _name;
    get id(): string;
    set id(id: string);
    get claim(): IClaimSection;
    set claim(claim: IClaimSection);
    get type(): string[];
    set type(type: string[]);
    get name(): string;
    set name(name: string);
    get context(): JsonLdContext;
    set context(context: JsonLdContext);
    static create<T extends BaseMetadata>({ metadata, claim, subject, }: ISignedCredCreationArgs<T>): Credential;
    static fromJSON(json: ICredentialAttrs): Credential;
    toJSON(): ICredentialAttrs;
}
