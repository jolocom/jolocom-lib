export declare const defaultTestDidDoc: {
    specVersion: number;
    '@context': {
        '@version': number;
        id: string;
        type: string;
        dc: string;
        rdfs: string;
        schema: string;
        sec: string;
        didv: string;
        xsd: string;
        specVersion: string;
        AuthenticationSuite: string;
        CryptographicKey: string;
        EquihashProof2017: string;
        GraphSignature2012: string;
        IssueCredential: string;
        LinkedDataSignature2015: string;
        LinkedDataSignature2016: string;
        RsaCryptographicKey: string;
        RsaSignatureAuthentication2018: string;
        RsaSigningKey2018: string;
        RsaSignature2015: string;
        RsaSignature2017: string;
        UpdateDidDescription: string;
        authentication: string;
        authenticationCredential: string;
        authorizationCapability: string;
        canonicalizationAlgorithm: string;
        capability: string;
        comment: string;
        controller: {
            '@id': string;
            '@type': string;
        };
        created: {
            '@id': string;
            '@type': string;
        };
        creator: {
            '@id': string;
            '@type': string;
        };
        description: string;
        digestAlgorithm: string;
        digestValue: string;
        domain: string;
        entity: string;
        equihashParameterAlgorithm: string;
        equihashParameterK: {
            '@id': string;
            '@type': string;
        };
        equihashParameterN: {
            '@id': string;
            '@type': string;
        };
        expires: {
            '@id': string;
            '@type': string;
        };
        field: {
            '@id': string;
            '@type': string;
        };
        label: string;
        minimumProofsRequired: string;
        minimumSignaturesRequired: string;
        name: string;
        nonce: string;
        normalizationAlgorithm: string;
        owner: {
            '@id': string;
            '@type': string;
        };
        permission: string;
        permittedProofType: string;
        privateKey: {
            '@id': string;
            '@type': string;
        };
        privateKeyPem: string;
        proof: string;
        proofAlgorithm: string;
        proofType: string;
        proofValue: string;
        publicKey: {
            '@id': string;
            '@type': string;
            '@container': string;
        };
        publicKeyHex: string;
        publicKeyPem: string;
        requiredProof: string;
        revoked: {
            '@id': string;
            '@type': string;
        };
        seeAlso: {
            '@id': string;
            '@type': string;
        };
        service: {
            '@id': string;
            '@type': string;
            '@container': string;
        };
        serviceEndpoint: string;
        signature: string;
        signatureAlgorithm: string;
        signatureValue: string;
        updated: {
            '@id': string;
            '@type': string;
        };
    }[];
    id: string;
    authentication: string[];
    publicKey: {
        controller: string;
        id: string;
        type: string;
        publicKeyHex: string;
    }[];
    service: any[];
    created: string;
    updated: string;
    proof: {
        created: string;
        type: string;
        nonce: string;
        signatureValue: string;
        creator: string;
    };
};
export declare const testDidDoc0: {
    '@context': {
        id: string;
        type: string;
        dc: string;
        rdfs: string;
        schema: string;
        sec: string;
        didv: string;
        xsd: string;
        AuthenticationSuite: string;
        CryptographicKey: string;
        LinkedDataSignature2016: string;
        authentication: string;
        created: {
            '@id': string;
            '@type': string;
        };
        creator: {
            '@id': string;
            '@type': string;
        };
        digestAlgorithm: string;
        digestValue: string;
        domain: string;
        entity: string;
        expires: {
            '@id': string;
            '@type': string;
        };
        name: string;
        nonce: string;
        normalizationAlgorithm: string;
        owner: {
            '@id': string;
            '@type': string;
        };
        privateKey: {
            '@id': string;
            '@type': string;
        };
        proof: string;
        proofAlgorithm: string;
        proofType: string;
        proofValue: string;
        publicKey: {
            '@id': string;
            '@type': string;
            '@container': string;
        };
        publicKeyHex: string;
        requiredProof: string;
        revoked: {
            '@id': string;
            '@type': string;
        };
        signature: string;
        signatureAlgorithm: string;
        signatureValue: string;
    }[];
    id: string;
    authentication: {
        publicKey: string;
        type: string;
    }[];
    publicKey: {
        owner: string;
        id: string;
        type: string;
        publicKeyHex: string;
    }[];
    service: any[];
    created: string;
    proof: {
        created: string;
        type: string;
        nonce: string;
        signatureValue: string;
        creator: string;
    };
};
export declare const testDidDoc1: {
    '@context': {
        id: string;
        type: string;
        dc: string;
        rdfs: string;
        schema: string;
        sec: string;
        didv: string;
        xsd: string;
        AuthenticationSuite: string;
        CryptographicKey: string;
        LinkedDataSignature2016: string;
        authentication: string;
        created: {
            '@id': string;
            '@type': string;
        };
        creator: {
            '@id': string;
            '@type': string;
        };
        digestAlgorithm: string;
        digestValue: string;
        domain: string;
        entity: string;
        expires: {
            '@id': string;
            '@type': string;
        };
        name: string;
        nonce: string;
        normalizationAlgorithm: string;
        owner: {
            '@id': string;
            '@type': string;
        };
        privateKey: {
            '@id': string;
            '@type': string;
        };
        proof: string;
        proofAlgorithm: string;
        proofType: string;
        proofValue: string;
        publicKey: {
            '@id': string;
            '@type': string;
            '@container': string;
        };
        publicKeyHex: string;
        requiredProof: string;
        revoked: {
            '@id': string;
            '@type': string;
        };
        signature: string;
        signatureAlgorithm: string;
        signatureValue: string;
    }[];
    id: string;
    authentication: {
        publicKey: string;
        type: string;
    }[];
    publicKey: {
        owner: string;
        id: string;
        type: string;
        publicKeyHex: string;
    }[];
    service: any[];
    created: string;
    proof: {
        created: string;
        type: string;
        nonce: string;
        signatureValue: string;
        creator: string;
    };
};
export declare const testDidDoc2: {
    '@context': {
        id: string;
        type: string;
        dc: string;
        rdfs: string;
        schema: string;
        sec: string;
        didv: string;
        xsd: string;
        AuthenticationSuite: string;
        CryptographicKey: string;
        LinkedDataSignature2016: string;
        authentication: string;
        created: {
            '@id': string;
            '@type': string;
        };
        creator: {
            '@id': string;
            '@type': string;
        };
        digestAlgorithm: string;
        digestValue: string;
        domain: string;
        entity: string;
        expires: {
            '@id': string;
            '@type': string;
        };
        name: string;
        nonce: string;
        normalizationAlgorithm: string;
        owner: {
            '@id': string;
            '@type': string;
        };
        privateKey: {
            '@id': string;
            '@type': string;
        };
        proof: string;
        proofAlgorithm: string;
        proofType: string;
        proofValue: string;
        publicKey: {
            '@id': string;
            '@type': string;
            '@container': string;
        };
        publicKeyHex: string;
        requiredProof: string;
        revoked: {
            '@id': string;
            '@type': string;
        };
        signature: string;
        signatureAlgorithm: string;
        signatureValue: string;
    }[];
    id: string;
    authentication: {
        publicKey: string;
        type: string;
    }[];
    publicKey: {
        owner: string;
        id: string;
        type: string;
        publicKeyHex: string;
    }[];
    service: any[];
    created: string;
    proof: {
        created: string;
        type: string;
        nonce: string;
        signatureValue: string;
        creator: string;
    };
};
export declare const testDidDoc3: {
    specVersion: number;
    '@context': {
        '@version': number;
        id: string;
        type: string;
        dc: string;
        rdfs: string;
        schema: string;
        sec: string;
        didv: string;
        xsd: string;
        specVersion: string;
        AuthenticationSuite: string;
        CryptographicKey: string;
        EquihashProof2017: string;
        GraphSignature2012: string;
        IssueCredential: string;
        LinkedDataSignature2015: string;
        LinkedDataSignature2016: string;
        RsaCryptographicKey: string;
        RsaSignatureAuthentication2018: string;
        RsaSigningKey2018: string;
        RsaSignature2015: string;
        RsaSignature2017: string;
        UpdateDidDescription: string;
        authentication: string;
        authenticationCredential: string;
        authorizationCapability: string;
        canonicalizationAlgorithm: string;
        capability: string;
        comment: string;
        controller: {
            '@id': string;
            '@type': string;
        };
        created: {
            '@id': string;
            '@type': string;
        };
        creator: {
            '@id': string;
            '@type': string;
        };
        description: string;
        digestAlgorithm: string;
        digestValue: string;
        domain: string;
        entity: string;
        equihashParameterAlgorithm: string;
        equihashParameterK: {
            '@id': string;
            '@type': string;
        };
        equihashParameterN: {
            '@id': string;
            '@type': string;
        };
        expires: {
            '@id': string;
            '@type': string;
        };
        field: {
            '@id': string;
            '@type': string;
        };
        label: string;
        minimumProofsRequired: string;
        minimumSignaturesRequired: string;
        name: string;
        nonce: string;
        normalizationAlgorithm: string;
        owner: {
            '@id': string;
            '@type': string;
        };
        permission: string;
        permittedProofType: string;
        privateKey: {
            '@id': string;
            '@type': string;
        };
        privateKeyPem: string;
        proof: string;
        proofAlgorithm: string;
        proofType: string;
        proofValue: string;
        publicKey: {
            '@id': string;
            '@type': string;
            '@container': string;
        };
        publicKeyHex: string;
        publicKeyPem: string;
        requiredProof: string;
        revoked: {
            '@id': string;
            '@type': string;
        };
        seeAlso: {
            '@id': string;
            '@type': string;
        };
        service: {
            '@id': string;
            '@type': string;
            '@container': string;
        };
        serviceEndpoint: string;
        signature: string;
        signatureAlgorithm: string;
        signatureValue: string;
        updated: {
            '@id': string;
            '@type': string;
        };
    }[];
    id: string;
    authentication: string[];
    publicKey: ({
        controller: string;
        id: string;
        type: string;
        publicKeyHex: string;
    } | {
        controller: string[];
        id: string;
        type: string;
        publicKeyHex: string;
    })[];
    service: any[];
    created: string;
    updated: string;
    proof: {
        created: string;
        type: string;
        nonce: string;
        signatureValue: string;
        creator: string;
    };
};
