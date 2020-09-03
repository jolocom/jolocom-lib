export declare const mockKeyId = "did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#keys-1";
export declare const mockIssuerDid = "did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
export declare const emailVerifiableCredentialHash = "7d659e5e3088453ba7e668297efdd985e74a49cebd3ce1f9951a09ee74530011";
export declare const emailVerifiableCredential: {
    '@context': import("@jolocom/protocol-ts").ContextEntry[];
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
};
export declare const unsignedEmailCredential: {
    '@context': import("@jolocom/protocol-ts").ContextEntry[];
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
};
