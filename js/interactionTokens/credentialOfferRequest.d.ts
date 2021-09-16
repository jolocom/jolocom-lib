import { CredentialOffer, CredentialOfferInputRequest, CredentialOfferMetadata, CredentialOfferRenderInfo, CredentialOfferRequestAttrs } from './interactionTokens.types';
export declare class CredentialOfferRequest {
    private _callbackURL;
    private _offeredCredentials;
    callbackURL: string;
    offeredCredentials: CredentialOffer[];
    getRenderInfoForType(type: string): CredentialOfferRenderInfo | undefined;
    getMetadataForType(type: string): CredentialOfferMetadata | undefined;
    getRequestedInputForType(type: string): CredentialOfferInputRequest | undefined;
    getOfferForType(type: string): CredentialOffer;
    readonly offeredTypes: string[];
    toJSON(): CredentialOfferRequestAttrs;
    static fromJSON(json: CredentialOfferRequestAttrs): CredentialOfferRequest;
}
