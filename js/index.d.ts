import 'reflect-metadata';
import { SoftwareKeyProvider } from './vaultedKeyProvider/softwareProvider';
import { KeyTypes } from './vaultedKeyProvider/types';
import { fuelKeyWithEther, getIssuerPublicKey } from './utils/helper';
export declare const JolocomLib: {
    parse: import("./parse/parse").ParseMethods;
    didMethods: {
        jolo: import("./didMethods/jolo").JoloDidMethod;
    };
    KeyProvider: typeof SoftwareKeyProvider;
    util: {
        constraintFunctions: import("@jolocom/protocol-ts/dist/lib/interactionTokens").IExposedConstraintFunctions;
        fuelKeyWithEther: typeof fuelKeyWithEther;
        getIssuerPublicKey: typeof getIssuerPublicKey;
        validateDigestable: (toValidate: import("@jolocom/protocol-ts/dist/lib/linkedDataSignature").IDigestable, resolver?: import("./didMethods/types").IResolver) => Promise<boolean>;
        validateDigestables: (toValidate: import("@jolocom/protocol-ts/dist/lib/linkedDataSignature").IDigestable[], resolver?: import("./didMethods/types").IResolver) => Promise<boolean[]>;
    };
    KeyTypes: typeof KeyTypes;
};
export { claimsMetadata } from '@jolocom/protocol-ts';
