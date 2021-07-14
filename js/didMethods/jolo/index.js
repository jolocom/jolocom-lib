"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolver_1 = require("./resolver");
const registrar_1 = require("./registrar");
const constants_1 = require("./constants");
const recovery_1 = require("./recovery");
const native_core_1 = require("@jolocom/native-core");
const utils_1 = require("../utils");
class JoloDidMethod {
    constructor(providerUrl = constants_1.PROVIDER_URL, contractAddress = constants_1.CONTRACT_ADDRESS, ipfsHost = constants_1.IPFS_ENDPOINT) {
        this.prefix = 'jolo';
        this.resolver = new resolver_1.JolocomResolver(providerUrl, contractAddress, ipfsHost);
        this.registrar = new registrar_1.JolocomRegistrar(providerUrl, contractAddress, ipfsHost);
    }
    async recoverFromSeed(seed, newPassword) {
        const keyProvider = await recovery_1.recoverJoloKeyProviderFromSeed(seed, newPassword, native_core_1.walletUtils);
        try {
            return {
                identityWallet: await utils_1.authAsIdentityFromKeyProvider(keyProvider, newPassword, this.resolver),
                succesfullyResolved: true,
            };
        }
        catch (e) {
            return {
                identityWallet: await utils_1.authAsIdentityFromKeyProvider(keyProvider, newPassword, await this.registrar.didDocumentFromKeyProvider(keyProvider, newPassword)),
                succesfullyResolved: false,
            };
        }
    }
}
exports.JoloDidMethod = JoloDidMethod;
//# sourceMappingURL=index.js.map