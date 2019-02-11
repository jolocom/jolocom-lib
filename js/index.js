"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var parse_1 = require("./parse/parse");
var registries_1 = require("./registries");
var softwareProvider_1 = require("./vaultedKeyProvider/softwareProvider");
var types_1 = require("./vaultedKeyProvider/types");
var credentialRequest_1 = require("./interactionTokens/credentialRequest");
var helper_1 = require("./utils/helper");
var validation_1 = require("./utils/validation");
exports.JolocomLib = {
    parse: parse_1.parse,
    registries: registries_1.registries,
    KeyProvider: softwareProvider_1.SoftwareKeyProvider,
    util: {
        constraintFunctions: credentialRequest_1.constraintFunctions,
        fuelKeyWithEther: helper_1.fuelKeyWithEther,
        getIssuerPublicKey: helper_1.getIssuerPublicKey,
        validateDigestable: validation_1.validateDigestable,
        validateDigestables: validation_1.validateDigestables
    },
    KeyTypes: types_1.KeyTypes,
};
var cred_types_jolocom_core_1 = require("cred-types-jolocom-core");
exports.claimsMetadata = cred_types_jolocom_core_1.claimsMetadata;
//# sourceMappingURL=index.js.map