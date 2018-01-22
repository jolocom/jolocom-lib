"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bs58 = require("bs58");
var DID = (function () {
    function DID(publicKey) {
        var prefix = 'did:jolo:';
        var suffix = bs58.encode(publicKey);
        this.identifier = prefix + suffix;
    }
    return DID;
}());
exports.default = DID;
//# sourceMappingURL=identity.js.map