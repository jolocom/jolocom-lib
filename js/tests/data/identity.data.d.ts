export declare const publicProfileCredJSON: {
    '@context': ({
        id: string;
        type: string;
        cred: string;
        schema: string;
        dc: string;
        xsd: string;
        sec: string;
        Credential: string;
        issuer: {
            '@id': string;
            '@type': string;
        };
        issued: {
            '@id': string;
            '@type': string;
        };
        claim: {
            '@id': string;
            '@type': string;
        };
        credential: {
            '@id': string;
            '@type': string;
        };
        expires: {
            '@id': string;
            '@type': string;
        };
        proof: {
            '@id': string;
            '@type': string;
        };
        EcdsaKoblitzSignature2016: string;
        created: {
            '@id': string;
            '@type': string;
        };
        creator: {
            '@id': string;
            '@type': string;
        };
        domain: string;
        nonce: string;
        signatureValue: string;
    } | {
        PublicProfileCredential: string;
        schema: string;
        name: string;
        description: string;
        image: string;
        url: string;
    })[];
    id: string;
    name: string;
    issuer: string;
    type: string[];
    claim: {
        name: string;
        description: string;
        url: string;
        image: string;
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
export declare const emailCredential: {
    '@context': ({
        id: string;
        type: string;
        cred: string;
        schema: string;
        dc: string;
        xsd: string;
        sec: string;
        Credential: string;
        issuer: {
            '@id': string;
            '@type': string;
        };
        issued: {
            '@id': string;
            '@type': string;
        };
        claim: {
            '@id': string;
            '@type': string;
        };
        credential: {
            '@id': string;
            '@type': string;
        };
        expires: {
            '@id': string;
            '@type': string;
        };
        proof: {
            '@id': string;
            '@type': string;
        };
        EcdsaKoblitzSignature2016: string;
        created: {
            '@id': string;
            '@type': string;
        };
        creator: {
            '@id': string;
            '@type': string;
        };
        domain: string;
        nonce: string;
        signatureValue: string;
        ProofOfEmailCredential?: undefined;
        email?: undefined;
    } | {
        ProofOfEmailCredential: string;
        schema: string;
        email: string;
        id?: undefined;
        type?: undefined;
        cred?: undefined;
        dc?: undefined;
        xsd?: undefined;
        sec?: undefined;
        Credential?: undefined;
        issuer?: undefined;
        issued?: undefined;
        claim?: undefined;
        credential?: undefined;
        expires?: undefined;
        proof?: undefined;
        EcdsaKoblitzSignature2016?: undefined;
        created?: undefined;
        creator?: undefined;
        domain?: undefined;
        nonce?: undefined;
        signatureValue?: undefined;
    })[];
    id: string;
    issuer: string;
    issued: string;
    type: string[];
    expires: string;
    proof: {
        created: string;
        type: string;
        nonce: string;
        signatureValue: string;
        creator: string;
    };
    claim: {
        email: string;
        id: string;
    };
    name: string;
};
