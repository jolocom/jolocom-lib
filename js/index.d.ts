import 'reflect-metadata';
import { SoftwareKeyProvider } from './vaultedKeyProvider/softwareProvider';
import { KeyTypes } from './vaultedKeyProvider/types';
import { fuelKeyWithEther, getIssuerPublicKey } from './utils/helper';
export declare const JolocomLib: {
    parse: {
        interactionToken: {
            fromJWT: typeof import("./interactionTokens/JSONWebToken").JSONWebToken.decode;
            fromJSON: typeof import("./interactionTokens/JSONWebToken").JSONWebToken.fromJSON;
        };
        credential: typeof import("./credentials/credential/credential").Credential.fromJSON;
        signedCredential: typeof import("./credentials/signedCredential/signedCredential").SignedCredential.fromJSON;
    };
    registries: {
        jolocom: {
            create: ({ ipfsConnector, ethereumConnector }?: import("./registries/types").IRegistryStaticCreationArgs) => import("./registries/jolocomRegistry").JolocomRegistry;
        };
    };
    KeyProvider: typeof SoftwareKeyProvider;
    util: {
        constraintFunctions: import("./interactionTokens/interactionTokens.types").IExposedConstraintFunctions;
        fuelKeyWithEther: typeof fuelKeyWithEther;
        getIssuerPublicKey: typeof getIssuerPublicKey;
        validateDigestable: (toValidate: import("./linkedDataSignature/types").IDigestable, customRegistry?: import("./registries/types").IRegistry) => Promise<boolean>;
        validateDigestables: (toValidate: import("./linkedDataSignature/types").IDigestable[], customRegistry?: import("./registries/types").IRegistry) => Promise<boolean[]>;
    };
    KeyTypes: typeof KeyTypes;
};
export { claimsMetadata } from 'cred-types-jolocom-core';
