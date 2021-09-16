"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const identityWallet_1 = require("../identityWallet/identityWallet");
const helper_1 = require("../utils/helper");
const identity_1 = require("../identity/identity");
exports.createIdentityFromKeyProvider = async (vaultedKeyProvider, decryptionPassword, registrar) => {
    const identity = await registrar.create(vaultedKeyProvider, decryptionPassword);
    const vaultKeys = await vaultedKeyProvider.getPubKeys(decryptionPassword);
    return new identityWallet_1.IdentityWallet({
        identity,
        vaultedKeyProvider,
        publicKeyMetadata: await helper_1.mapPublicKeys(identity, vaultKeys),
    });
};
exports.authAsIdentityFromKeyProvider = async (vkp, pass, identityOrResolver) => {
    const identity = identityOrResolver instanceof identity_1.Identity
        ? identityOrResolver
        : await identityOrResolver.resolve(vkp.id);
    const vaultKeys = await vkp.getPubKeys(pass);
    return new identityWallet_1.IdentityWallet({
        vaultedKeyProvider: vkp,
        identity,
        publicKeyMetadata: await helper_1.mapPublicKeys(identity, vaultKeys),
    });
};
//# sourceMappingURL=utils.js.map