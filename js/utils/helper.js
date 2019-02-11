"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethereumjs_util_1 = require("ethereumjs-util");
var node_fetch_1 = require("node-fetch");
function keyIdToDid(keyId) {
    return keyId.substring(0, keyId.indexOf('#'));
}
exports.keyIdToDid = keyIdToDid;
function getIssuerPublicKey(keyId, ddo) {
    var relevantKeySection = ddo.publicKey.find(function (section) { return section.id === keyId; });
    if (!relevantKeySection) {
        throw new Error('No relevant key-id found');
    }
    return Buffer.from(relevantKeySection.publicKeyHex, 'hex');
}
exports.getIssuerPublicKey = getIssuerPublicKey;
function handleValidationStatus(success, key) {
    if (!success) {
        throw new Error(ErrorKeys[key] || 'Unknown Error key');
    }
}
exports.handleValidationStatus = handleValidationStatus;
var ErrorKeys = {
    exp: 'Token expired',
    sig: 'Signature on token is invalid',
    nonce: 'The token nonce deviates from request',
    aud: 'You are not the intended audience of received token'
};
function fuelKeyWithEther(publicKey) {
    return node_fetch_1.default('https://faucet.jolocom.com/request/', {
        method: 'POST',
        body: JSON.stringify({ address: exports.publicKeyToAddress(publicKey) }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
exports.fuelKeyWithEther = fuelKeyWithEther;
exports.publicKeyToAddress = function (publicKey) {
    return ethereumjs_util_1.addHexPrefix(ethereumjs_util_1.pubToAddress(publicKey, true).toString('hex'));
};
//# sourceMappingURL=helper.js.map