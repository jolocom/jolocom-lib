export declare const signedCredTestVector0: {
    signerDidDoc: {
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
    signedCredential: {
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
};
export declare const signedCredTestVector1: {
    signerDidDoc: {
        '@context': string;
        id: string;
        publicKey: {
            controller: string;
            id: string;
            type: string;
            publicKeyHex: string;
        }[];
        proof: {
            created: string;
            type: string;
            nonce: string;
            signatureValue: string;
            creator: string;
        };
    };
    signedCredential: {
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
            ProofOfPostalAddressCredential?: undefined;
            addressLine1?: undefined;
            addressLine2?: undefined;
            postalCode?: undefined;
            city?: undefined;
            country?: undefined;
        } | {
            ProofOfPostalAddressCredential: string;
            schema: string;
            addressLine1: string;
            addressLine2: string;
            postalCode: string;
            city: string;
            country: string;
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
            addressLine1: string;
            addressLine2: string;
            city: string;
            postalCode: number;
            id: string;
        };
        name: string;
    };
};
export declare const signedCredTestVector2: {
    signerDidDoc: {
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
    signedCredential: {
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
            ProofOfPostalAddressCredential?: undefined;
            addressLine1?: undefined;
            addressLine2?: undefined;
            postalCode?: undefined;
            city?: undefined;
            country?: undefined;
        } | {
            ProofOfPostalAddressCredential: string;
            schema: string;
            addressLine1: string;
            addressLine2: string;
            postalCode: string;
            city: string;
            country: string;
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
            addressLine1: string;
            addressLine2: string;
            city: string;
            postalCode: number;
            id: string;
        };
        name: string;
    };
};
