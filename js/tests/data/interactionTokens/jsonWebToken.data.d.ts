export declare const validSignedCredReqJWT: {
    header: {
        typ: string;
        alg: string;
    };
    payload: {
        interactionToken: {
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
        iat: number;
        exp: number;
        iss: string;
        typ: string;
        jti: string;
    };
    signature: string;
};
export declare const invalidSignature = "d904b6ca775f555121012ed7ec55be5958703411f5e9af0d93f17994d5e3bb3b3afdbb49216ffc0b005562d928690e4c94803e9f17ac811480dc0fff46b28613";
export declare const validSignedCredResJWT: {
    payload: {
        interactionToken: {
            suppliedCredentials: {
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
            callbackURL: string;
        };
        typ: string;
        iat: number;
        exp: number;
        iss: string;
        aud: string;
        jti: string;
    };
    signature: string;
    header: {
        typ: string;
        alg: string;
    };
};
export declare const invalidNonce: string;
export declare const encodedValidCredReqJWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpbnRlcmFjdGlvblRva2VuIjp7ImNyZWRlbnRpYWxSZXF1aXJlbWVudHMiOlt7InR5cGUiOlsiQ3JlZGVudGlhbCIsIlByb29mT2ZFbWFpbENyZWRlbnRpYWwiXSwiY29uc3RyYWludHMiOlt7Ij09IjpbeyJ2YXIiOiJpc3N1ZXIifSwiZGlkOmpvbG86YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYSJdfV19XSwiY2FsbGJhY2tVUkwiOiJodHRwOi8vdGVzdC5jb20ifSwiaWF0IjowLCJleHAiOjM2MDAwMDAsImlzcyI6ImRpZDpqb2xvOmIyZDVkOGQ2Y2MxNDAwMzM0MTliNTRhMjM3YTVkYjUxNzEwNDM5ZjlmNDYyZDFmYzk4ZjY5OGVjYTdjZTk3Nzcja2V5cy0xIiwidHlwIjoiY3JlZGVudGlhbFJlcXVlc3QiLCJqdGkiOiIyYTk3YjM1ZmU3NGI1In0.d904b6ca775f555121012ed7ec55be5958703411f5e9af0d93f17994d5e3bb3b3afdbb49216ffc0b005562d928690e4c94803e9f17ac811480dc0fff46b28623";
export declare const expiredEncodedSimpleCredReqJWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjAsImV4cCI6MCwiaW50ZXJhY3Rpb25Ub2tlbiI6eyJjcmVkZW50aWFsUmVxdWlyZW1lbnRzIjpbeyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJQcm9vZk9mRW1haWxDcmVkZW50aWFsIl0sImNvbnN0cmFpbnRzIjpbeyI9PSI6W3sidmFyIjoiaXNzdWVyIn0sImRpZDpqb2xvOmFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEiXX1dfV0sImNhbGxiYWNrVVJMIjoiaHR0cDovL3Rlc3QuY29tIn0sImlzcyI6ImRpZDpqb2xvOmIyZDVkOGQ2Y2MxNDAwMzM0MTliNTRhMjM3YTVkYjUxNzEwNDM5ZjlmNDYyZDFmYzk4ZjY5OGVjYTdjZTk3Nzcja2V5cy0xIiwidHlwIjoiY3JlZGVudGlhbFJlcXVlc3QifQ.4fe903a33015a63a6d6e8a1054584e54b9f6e7ffea5ab196f940c29b7ffa14ef18a19af87c4d848db5dfa6d70e3a4d9b194da83e7eeaa3db0602e9d2d65c53d6";
export declare const hashedValidCredReqJWT = "96f55602967b22a28c6bc5a85dbba80aea67248623a9b8df8c118b6df84679da";
