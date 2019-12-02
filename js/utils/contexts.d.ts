export declare const defaultContext: {
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
}[];
export declare const defaultContextIdentity: {
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
