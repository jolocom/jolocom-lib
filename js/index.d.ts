import 'reflect-metadata';
import { fuelKeyWithEther } from './utils/helper';
import { SoftwareKeyProvider, KeyTypes } from '@jolocom/vaulted-key-provider';
export declare const JolocomLib: {
    parse: import("./parse/parse").ParseMethods;
    didMethods: {
        jolo: import("./didMethods/jolo").JoloDidMethod;
    };
    KeyProvider: typeof SoftwareKeyProvider;
    util: {
        constraintFunctions: import("@jolocom/protocol-ts/dist/lib/interactionTokens").IExposedConstraintFunctions;
        fuelKeyWithEther: typeof fuelKeyWithEther;
        validateDigestable: (toValidate: import("@jolocom/protocol-ts/dist/lib/linkedDataSignature").IDigestable, resolver?: import("./didMethods/types").IResolver) => Promise<boolean>;
        validateDigestables: (toValidate: import("@jolocom/protocol-ts/dist/lib/linkedDataSignature").IDigestable[], resolver?: import("./didMethods/types").IResolver) => Promise<boolean[]>;
    };
    KeyTypes: typeof KeyTypes;
};
export { claimsMetadata } from '@jolocom/protocol-ts';
