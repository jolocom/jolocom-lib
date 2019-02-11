import { ICredentialOfferAttrs } from './interactionTokens.types';
export declare class CredentialOffer {
    private _callbackURL;
    private _instant;
    private _requestedInput;
    instant: boolean;
    requestedInput: {
        [key: string]: string | undefined;
    };
    callbackURL: string;
    toJSON(): ICredentialOfferAttrs;
    static fromJSON(json: ICredentialOfferAttrs): CredentialOffer;
}
