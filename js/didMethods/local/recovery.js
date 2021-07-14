"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vaulted_key_provider_1 = require("@jolocom/vaulted-key-provider");
const native_core_1 = require("@jolocom/native-core");
const ed25519_hd_key_rn_1 = require("@hawkingnetwork/ed25519-hd-key-rn");
const utils_1 = require("../utils");
const bip39_1 = require("bip39");
const DERIVATION_PATHS = {
    controlKey: "m/73'/0'/0'",
    preRotatedControlKey: "m/73'/0'/1'",
    encKey: "m/73'/1'/0'",
    preRotatedEncKey: "m/73'/1'/1'",
};
const toBase64UrlSafe = (toEncode) => {
    const b64 = toEncode.toString('base64');
    return b64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
};
exports.slip10DeriveKey = (seed) => (path) => ed25519_hd_key_rn_1.derivePath(path, seed).key;
exports.recoverJunKeyProviderFromSeed = async (seed, newPassword, impl) => {
    const derivationFn = exports.slip10DeriveKey(seed);
    const controlKey = toBase64UrlSafe(derivationFn(DERIVATION_PATHS.controlKey));
    const preRotatedControlKey = toBase64UrlSafe(derivationFn(DERIVATION_PATHS.preRotatedControlKey));
    const encryptionKey = toBase64UrlSafe(derivationFn(DERIVATION_PATHS.encKey));
    const preRotatedEncryptionKey = toBase64UrlSafe(derivationFn(DERIVATION_PATHS.preRotatedEncKey));
    const { id, encryptedWallet, inceptionEvent } = await native_core_1.getIcpFromKeySet({
        live_keys: JSON.stringify([controlKey, encryptionKey]),
        pre_rotated_keys: JSON.stringify([
            preRotatedControlKey,
            preRotatedEncryptionKey,
        ]),
        password: newPassword,
    });
    const keyProvider = await vaulted_key_provider_1.SoftwareKeyProvider.newEmptyWallet(impl, id, newPassword);
    keyProvider._encryptedWallet = Buffer.from(encryptedWallet, 'base64');
    return {
        keyProvider,
        inceptionEvent: inceptionEvent,
    };
};
exports.junMnemonicToEncryptedWallet = async (mnemonicPhrase, newPassword, didMethod, impl) => {
    const seed = bip39_1.mnemonicToEntropy(mnemonicPhrase);
    const { keyProvider, inceptionEvent } = await exports.recoverJunKeyProviderFromSeed(Buffer.from(seed, 'hex'), newPassword, impl);
    await didMethod.registrar.encounter(inceptionEvent);
    return utils_1.authAsIdentityFromKeyProvider(keyProvider, newPassword, didMethod.resolver);
};
//# sourceMappingURL=recovery.js.map