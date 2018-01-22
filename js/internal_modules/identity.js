"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bs58 = require("bs58");
var DID = (function () {
    function DID(publicKey) {
        var fragment = bs58.encode(publicKey);
        this.identifier = 'did:jolo:' + fragment;
    }
    return DID;
}());
exports.default = DID;
//# sourceMappingURL=identity.js.map