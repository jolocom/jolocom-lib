import { CredentialOfferResponseAttrs, CredentialOfferResponseSelection } from './interactionTokens.types';
import { CredentialOfferRequest } from './credentialOfferRequest';
export declare class CredentialOfferResponse {
    private _callbackURL;
    private _selectedCredentials;
    get callbackURL(): string;
    set callbackURL(callbackURL: string);
    get selectedCredentials(): CredentialOfferResponseSelection[];
    set selectedCredentials(selectedCredentials: CredentialOfferResponseSelection[]);
    satisfiesRequest({ offeredTypes }: CredentialOfferRequest): boolean;
    toJSON(): CredentialOfferResponseAttrs;
    static fromJSON(json: CredentialOfferResponseAttrs): CredentialOfferResponse;
}
