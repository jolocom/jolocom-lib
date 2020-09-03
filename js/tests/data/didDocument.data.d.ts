export declare const mockDid = "did:jolo:b2d5d8d6cc140033419b54a237a5db51710439f9f462d1fc98f698eca7ce9777";
export declare const mockIpfsHash = "QmZCEmfiKZhRPB88cEqmcHzQu6siSmVpieG6HTQse4e4Js";
export declare const mockKeyId: string;
export declare const mockKeyId2: string;
export declare const mockPublicKeyHex = "03848af62bffceb57631780ac0e0726106ee1c23262d6fd7ef906559d68f53a551";
export declare const didDocumentJSONv0: {
    authentication: {
        publicKey: string;
        type: string;
    }[];
    publicKey: {
        id: string;
        type: string;
        owner: string;
        publicKeyHex: string;
    }[];
    service: {
        id: string;
        type: string;
        serviceEndpoint: string;
        description: string;
    }[];
    created: string;
    proof: {
        type: string;
        creator: string;
        nonce: string;
        signatureValue: string;
        created: string;
    };
    '@context': import("cred-types-jolocom-core").ContextEntry[];
    id: string;
};
export declare const didDocumentJSON: {
    specVersion: number;
    authentication: (string | {
        id: string;
        type: string;
        controller: string;
        publicKeyHex: string;
    })[];
    publicKey: {
        id: string;
        type: string;
        controller: string;
        publicKeyHex: string;
    }[];
    service: {
        id: string;
        type: string;
        serviceEndpoint: string;
        description: string;
    }[];
    created: string;
    updated: string;
    proof: {
        type: string;
        creator: string;
        nonce: string;
        signatureValue: string;
        created: string;
    };
    '@context': import("cred-types-jolocom-core").ContextEntry[];
    id: string;
};
export declare const normalizedDidDocument: string;
