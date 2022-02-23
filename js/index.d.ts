import 'reflect-metadata';
import { fuelKeyWithEther } from './utils/helper';
import { SoftwareKeyProvider, KeyTypes } from '@jolocom/vaulted-key-provider';
import { CredentialVerifier } from './credentials/v1.1/credentialVerifier';
import { CredentialSigner } from './credentials/v1.1/credentialSigner';
import { Credential } from './credentials/v1.1/credential';
import { SignedCredential } from './credentials/v1.1/signedCredential';
import { SupportedSuites } from './linkedDataSignature';
import { IdentityWallet } from './identityWallet/identityWallet';
export declare const JolocomLib: {
    credentials: {
        Credential: typeof Credential;
        SignedCredential: typeof SignedCredential;
    };
    parse: import("./parse/parse").ParseMethods;
    parseAndValidate: {
        interactionToken: (jwt: string, signer: import("./identity/identity").Identity) => Promise<import("./interactionTokens/JSONWebToken").JSONWebToken<import("./interactionTokens/JSONWebToken").JWTEncodable>>;
        didDocument: (didDocument: import("@jolocom/protocol-ts").IDidDocumentAttrs) => Promise<import("./identity/didDocument/didDocument").DidDocument>;
        signedCredential: (signedCredential: import("@jolocom/protocol-ts").ISignedCredentialAttrs, signer: import("./identity/identity").Identity) => Promise<import("./credentials/outdated/signedCredential").SignedCredential>;
    };
    didMethods: {
        jolo: import("./didMethods/jolo").JoloDidMethod;
        jun: import("./didMethods/local").LocalDidMethod;
    };
    KeyProvider: typeof SoftwareKeyProvider;
    util: {
        constraintFunctions: import("@jolocom/protocol-ts").IExposedConstraintFunctions;
        fuelKeyWithEther: typeof fuelKeyWithEther;
        validateDigestable: (toValidate: import("@jolocom/protocol-ts").IDigestable, resolverOrIdentity?: import("./utils/validation").IdentityOrResolver) => Promise<boolean>;
        validateDigestables: (toValidate: import("@jolocom/protocol-ts").IDigestable[], resolverOrIdentity?: import("./utils/validation").IdentityOrResolver) => Promise<boolean[]>;
    };
    KeyTypes: typeof KeyTypes;
    LinkedDataProofTypes: typeof SupportedSuites;
};
export { CredentialSigner, CredentialVerifier, IdentityWallet };
export { SoftwareKeyProvider, IVaultedKeyProvider, } from '@jolocom/vaulted-key-provider';
export { claimsMetadata } from '@jolocom/protocol-ts';
