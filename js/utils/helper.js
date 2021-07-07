"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
const node_fetch_1 = require("node-fetch");
const vaulted_key_provider_1 = require("@jolocom/vaulted-key-provider");
const errors_1 = require("../errors");
const utils_1 = require("ethers/lib/utils");
exports.stripHexPrefix = (hexPrefixedString) => {
    return ethereumjs_util_1.addHexPrefix(hexPrefixedString).slice(2);
};
exports.parseHexOrBase64 = (hexOrB64) => {
    return utils_1.isHexString(ethereumjs_util_1.addHexPrefix(hexOrB64))
        ? Buffer.from(exports.stripHexPrefix(hexOrB64), 'hex')
        : Buffer.from(hexOrB64, 'base64');
};
function keyIdToDid(keyId) {
    return keyId.substring(0, keyId.indexOf('#'));
}
exports.keyIdToDid = keyIdToDid;
function fuelKeyWithEther(publicKey) {
    return node_fetch_1.default('https://faucet.jolocom.com/request/', {
        method: 'POST',
        body: JSON.stringify({ address: exports.publicKeyToAddress(publicKey) }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
exports.fuelKeyWithEther = fuelKeyWithEther;
exports.publicKeyToAddress = (publicKey) => ethereumjs_util_1.addHexPrefix(ethereumjs_util_1.pubToAddress(publicKey, true).toString('hex'));
exports.mapPublicKeys = async (identity, vkpKeys) => {
    const { keyId, did } = identity.didDocument.signer;
    const signingKeyRef = keyId.includes('did:') ? keyId : `${did}${keyId}`;
    const encKey = identity.didDocument.publicKey.find(k => k.type === vaulted_key_provider_1.KeyTypes.x25519KeyAgreementKey2019);
    const encKeyRef = encKey &&
        (encKey.id.startsWith('did:')
            ? encKey.id
            : `${encKey.controller}${encKey.id}`);
    const sigKey = vkpKeys.some(k => k.controller.find(c => c === signingKeyRef));
    if (!sigKey) {
        throw new Error(errors_1.ErrorCodes.PublicKeyNotFound);
    }
    return {
        signingKeyId: signingKeyRef,
        encryptionKeyId: encKeyRef,
    };
};
//# sourceMappingURL=helper.js.map