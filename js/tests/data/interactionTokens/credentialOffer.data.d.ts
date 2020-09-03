export declare const credentialOfferRequestCreationArgs: {
    callbackURL: string;
    offeredCredentials: {
        type: string;
        renderInfo: {
            background: {
                color: string;
            };
        };
        requestedInput: {};
        metadata: {
            asynchronous: boolean;
        };
    }[];
};
export declare const credentialOfferResponseCreationArgs: {
    callbackURL: string;
    selectedCredentials: {
        type: string;
    }[];
};
