"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
function publicKeyToJoloDID(publicKey) {
    const prefix = 'did:jolo:';
    const suffix = ethereumjs_util_1.keccak256(publicKey);
    return prefix + suffix.toString('hex');
}
exports.publicKeyToJoloDID = publicKeyToJoloDID;
//# sourceMappingURL=utils.js.map