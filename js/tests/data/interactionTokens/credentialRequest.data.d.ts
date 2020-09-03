export declare const credentialSet: {
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
export declare const simpleCredRequestJSON: {
    callbackURL: string;
    credentialRequirements: {
        type: string[];
        constraints: {
            '==': (string | {
                var: string;
            })[];
        }[];
    }[];
};
export declare const emptyConstraintsRequestJSON: {
    credentialRequirements: {
        type: string[];
        constraints: any[];
    }[];
    callbackURL: string;
};
export declare const undefinedConstraintsRequestJSON: {
    credentialRequirements: any[];
    callbackURL: string;
};
export declare const extendedCredRequestJSON: {
    credentialRequirements: {
        type: string[];
        constraints: {
            '==': (string | {
                var: string;
            })[];
        }[];
    }[];
    callbackURL: string;
};
export declare const expectedIsOutput: {
    '==': (string | {
        var: string;
    })[];
};
export declare const expectedNotOutput: {
    '!=': (string | {
        var: string;
    })[];
};
export declare const expectedGreaterOutput: {
    '>': (Date | {
        var: string;
    })[];
};
export declare const expectedSmallerOutput: {
    '<': (Date | {
        var: string;
    })[];
};
