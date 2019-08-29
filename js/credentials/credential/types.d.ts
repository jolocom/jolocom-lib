import { ContextEntry, ClaimInterface } from 'cred-types-jolocom-core';
declare type ClaimType = string | number | boolean | {};
export declare type ClaimEntry = ClaimType | ClaimInterface;
export interface IClaimSection {
    id?: string;
    [x: string]: ClaimEntry;
}
export interface ICredentialAttrs {
    '@context': ContextEntry[];
    type: string[];
    name?: string;
    claim: ClaimEntry;
}
export {};
