import { ContextEntry } from '@jolocom/protocol-ts';
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
export declare const defaultContextIdentity: ContextEntry[];
