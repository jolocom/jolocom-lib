"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const vaulted_key_provider_1 = require("@jolocom/vaulted-key-provider");
__export(require("@jolocom/protocol-ts/dist/lib/interactionTokens"));
var SupportedJWA;
(function (SupportedJWA) {
    SupportedJWA["ES256KR"] = "ES256K-R";
    SupportedJWA["ES256K"] = "ES256K";
    SupportedJWA["EdDSA"] = "EdDSA";
})(SupportedJWA = exports.SupportedJWA || (exports.SupportedJWA = {}));
exports.KeyTypeToJWA = {
    [vaulted_key_provider_1.KeyTypes.ecdsaSecp256k1VerificationKey2019]: SupportedJWA.ES256K,
    [vaulted_key_provider_1.KeyTypes.ecdsaSecp256k1RecoveryMethod2020]: SupportedJWA.ES256KR,
    [vaulted_key_provider_1.KeyTypes.ed25519VerificationKey2018]: SupportedJWA.EdDSA
};
//# sourceMappingURL=types.js.map