import { BaseMetadata } from '@jolocom/protocol-ts';
interface IBirthDateClaimInterface extends BaseMetadata {
    claimInterface?: {
        birthDate: number;
        birthMonth: string;
        birthYear: number;
    };
}
export interface INestedAddressClaimInterface extends BaseMetadata {
    claimInterface?: {
        address: {
            street: string;
            postalCode: string;
            city: string;
        };
    };
}
export declare const mockEmailCredCreationAttrs: {
    metadata: import("@jolocom/protocol-ts").EmailClaimMetadata;
    subject: string;
    claim: {
        email: string;
    };
};
export declare const mockNameCredCreationAttrs: {
    metadata: import("@jolocom/protocol-ts").NameClaimMetadata;
    subject: string;
    claim: {
        givenName: string;
        familyName: string;
    };
};
export declare const mockAddrCredCreationAttrs: {
    metadata: INestedAddressClaimInterface;
    subject: string;
    claim: {
        address: {
            street: string;
            postalCode: string;
            city: string;
        };
    };
};
export declare const mockBirthdayCredCreationAttrs: {
    metadata: IBirthDateClaimInterface;
    subject: string;
    claim: {
        birthDate: number;
        birthMonth: string;
        birthYear: number;
    };
};
export declare const emailCredentialJSON: {
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
        email: string;
        schema: string;
        ProofOfEmailCredential: string;
    })[];
    type: string[];
    claim: {
        email: string;
        id: string;
    };
    name: string;
};
export declare const nameCredentialJSON: {
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
        ProofOfNameCredential: string;
        familyName: string;
        givenName: string;
        schema: string;
    })[];
    type: string[];
    claim: {
        id: string;
        givenName: string;
        familyName: string;
    };
    name: string;
};
export declare const birthdayCredentialJSON: {
    '@context': (string | {
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
        test: string;
    })[];
    type: string[];
    claim: {
        id: string;
        birthDate: number;
        birthMonth: string;
        birthYear: number;
    };
    name: string;
};
export declare const addressCredentialJSON: {
    '@context': (string | {
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
        test: string;
    })[];
    type: string[];
    claim: {
        id: string;
        address: {
            street: string;
            postalCode: string;
            city: string;
        };
    };
    name: string;
};
export {};
