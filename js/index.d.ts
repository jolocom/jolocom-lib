import 'reflect-metadata';
import { SoftwareKeyProvider } from './vaultedKeyProvider/softwareProvider';
import { KeyTypes } from './vaultedKeyProvider/types';
import { fuelKeyWithEther, getIssuerPublicKey } from './utils/helper';
export declare const JolocomLib: {
    parse: import("./parse/parse").ParseMethods;
    registries: {
        jolocom: {
            create: (configuration?: import("./registries/types").IRegistryStaticCreationArgs) => import("./registries/jolocomRegistry").JolocomRegistry;
        };
    };
    KeyProvider: typeof SoftwareKeyProvider;
    util: {
        constraintFunctions: import("./interactionTokens/interactionTokens.types").IExposedConstraintFunctions;
        fuelKeyWithEther: typeof fuelKeyWithEther;
        getIssuerPublicKey: typeof getIssuerPublicKey;
        validateDigestable: (toValidate: import("./linkedDataSignature/types").IDigestable, customResolver?: import("did-resolver").Resolver) => Promise<boolean>;
        validateDigestables: (toValidate: import("./linkedDataSignature/types").IDigestable[], customResolver?: import("did-resolver").Resolver) => Promise<boolean[]>;
    };
    KeyTypes: typeof KeyTypes;
};
export { claimsMetadata } from 'cred-types-jolocom-core';
