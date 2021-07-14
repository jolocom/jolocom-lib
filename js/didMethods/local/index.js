"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registrar_1 = require("./registrar");
const resolver_1 = require("./resolver");
const db_1 = require("@jolocom/local-resolver-registrar/js/db");
const native_core_1 = require("@jolocom/native-core");
const utils_1 = require("../utils");
const recovery_1 = require("./recovery");
class LocalDidMethod {
    constructor(db = db_1.createDb()) {
        this.prefix = 'jun';
        this.resolver = new resolver_1.LocalResolver(db, native_core_1.validateEvents);
        this.registrar = new registrar_1.LocalRegistrar(db);
    }
    async recoverFromSeed(seed, newPassword) {
        const { keyProvider, inceptionEvent } = await recovery_1.recoverJunKeyProviderFromSeed(seed, newPassword, native_core_1.walletUtils);
        await this.registrar.encounter(inceptionEvent);
        return {
            identityWallet: await utils_1.authAsIdentityFromKeyProvider(keyProvider, newPassword, this.resolver),
            succesfullyResolved: true,
        };
    }
}
exports.LocalDidMethod = LocalDidMethod;
//# sourceMappingURL=index.js.map