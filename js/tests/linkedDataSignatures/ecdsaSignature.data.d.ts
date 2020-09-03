/// <reference types="node" />
export declare const signatureAttributes: {
    type: string;
    creator: string;
    nonce: string;
    signatureValue: string;
    created: string;
};
export declare const incompleteSignatureAttrs: {
    created: string;
    creator: string;
    nonce: string;
    signatureValue: string;
    type: string;
};
export declare const normalizedSignatureSection = "_:c14n0 <http://purl.org/dc/terms/created> \"1970-01-01T00:00:00.000Z\"^^<http://www.w3.org/2001/XMLSchema#dateTime> .\n_:c14n0 <http://purl.org/dc/terms/creator> <did:jolo:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa#keys-1> .\n_:c14n0 <https://w3id.org/security#nonce> \"1842fb5f567dd532\" .\n";
export declare const signatureSectionAsBytes: Buffer;
