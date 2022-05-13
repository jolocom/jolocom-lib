import { CredentialOffer, CredentialOfferRequestAttrs } from './interactionTokens.types';
export declare class CredentialOfferRequest {
    private _callbackURL;
    private _offeredCredentials;
    get callbackURL(): string;
    set callbackURL(callbackURL: string);
    get offeredCredentials(): CredentialOffer[];
    set offeredCredentials(offeredCredentials: CredentialOffer[]);
    getOfferForType(type: string): CredentialOffer;
    get offeredTypes(): string[];
    toJSON(): CredentialOfferRequestAttrs;
    static fromJSON(json: CredentialOfferRequestAttrs): CredentialOfferRequest;
}
