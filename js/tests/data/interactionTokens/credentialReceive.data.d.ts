export declare const jsonCredReceive: {
    signedCredentials: {
        '@context': import("cred-types-jolocom-core").ContextEntry[];
        id: string;
        name: string;
        issuer: string;
        type: string[];
        claim: {
            email: string;
            id: string;
        };
        issued: string;
        expires: string;
        proof: {
            type: string;
            creator: string;
            nonce: string;
            signatureValue: string;
            created: string;
        };
    }[];
};
