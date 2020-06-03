import { ClaimInterface } from 'cred-types-jolocom-core';
import { JsonLdObject } from '../../linkedData/types';
declare type ClaimType = string | number | boolean | {};
export declare type ClaimEntry = ClaimType | ClaimInterface;
export interface IClaimSection {
    id?: string;
    [x: string]: ClaimEntry;
}
export interface ICredentialAttrs extends JsonLdObject {
    type: string[];
    name?: string;
    claim: ClaimEntry;
}
export {};
