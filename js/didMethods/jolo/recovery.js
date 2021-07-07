"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vaulted_key_provider_1 = require("@jolocom/vaulted-key-provider");
const constants_1 = require("./constants");
const hdkey_1 = require("hdkey");
const utils_1 = require("./utils");
const { JOLO_DERIVATION_PATH, ETH_DERIVATION_PATH } = constants_1.KEY_PATHS;
const { SIGNING_KEY_REF, ENCRYPTION_KEY_REF, ANCHOR_KEY_REF } = constants_1.KEY_REFS;
exports.recoverJoloKeyProviderFromSeed = async (seed, newPassword, impl, originalDid) => {
    const joloKeys = hdkey_1.fromMasterSeed(seed).derive(JOLO_DERIVATION_PATH);
    const ethKeys = hdkey_1.fromMasterSeed(seed).derive(ETH_DERIVATION_PATH);
    const did = originalDid || utils_1.publicKeyToJoloDID(joloKeys.publicKey);
    const skp = await vaulted_key_provider_1.SoftwareKeyProvider.newEmptyWallet(impl, did, newPassword);
    await skp.changeId(newPassword, did);
    await skp.addContent(newPassword, {
        type: ['BIP32JolocomIdentitySeedv0'],
        value: seed.toString('hex'),
    });
    await skp.addContent(newPassword, {
        controller: [`${did}#${SIGNING_KEY_REF}`],
        type: vaulted_key_provider_1.KeyTypes.ecdsaSecp256k1VerificationKey2019,
        publicKeyHex: joloKeys.publicKey.toString('hex'),
        private_key: joloKeys.privateKey.toString('hex'),
    });
    await skp.addContent(newPassword, {
        controller: [`${did}#${ANCHOR_KEY_REF}`],
        type: vaulted_key_provider_1.KeyTypes.ecdsaSecp256k1RecoveryMethod2020,
        publicKeyHex: ethKeys.publicKey.toString('hex'),
        private_key: ethKeys.privateKey.toString('hex'),
    });
    await skp.newKeyPair(newPassword, 'X25519KeyAgreementKey2019', `${did}#${ENCRYPTION_KEY_REF}`);
    return skp;
};
//# sourceMappingURL=recovery.js.map