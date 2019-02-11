"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createHash = require("create-hash");
var ethereumjs_util_1 = require("ethereumjs-util");
function sha256(data) {
    return createHash('sha256')
        .update(data)
        .digest();
}
exports.sha256 = sha256;
function publicKeyToDID(publicKey) {
    var prefix = 'did:jolo:';
    var suffix = ethereumjs_util_1.keccak256(publicKey);
    return prefix + suffix.toString('hex');
}
exports.publicKeyToDID = publicKeyToDID;
function generateRandomID(nrOfBytes) {
    return Math.random()
        .toString(16)
        .substr(2);
}
exports.generateRandomID = generateRandomID;
//# sourceMappingURL=crypto.js.map