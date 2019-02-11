"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Identity = (function () {
    function Identity() {
    }
    Object.defineProperty(Identity.prototype, "did", {
        get: function () {
            return this.didDocument.did;
        },
        set: function (did) {
            this.didDocument.did = did;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Identity.prototype, "didDocument", {
        get: function () {
            return this._didDocument;
        },
        set: function (didDocument) {
            this._didDocument = didDocument;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Identity.prototype, "serviceEndpointSections", {
        get: function () {
            return this.didDocument.service;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Identity.prototype, "publicKeySection", {
        get: function () {
            return this.didDocument.publicKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Identity.prototype, "publicProfile", {
        get: function () {
            return this._publicProfileCredential;
        },
        set: function (publicProfile) {
            this._publicProfileCredential = publicProfile;
        },
        enumerable: true,
        configurable: true
    });
    Identity.fromDidDocument = function (_a) {
        var didDocument = _a.didDocument, publicProfile = _a.publicProfile;
        var identity = new Identity();
        identity.didDocument = didDocument;
        if (publicProfile) {
            identity.publicProfile = publicProfile;
        }
        return identity;
    };
    return Identity;
}());
exports.Identity = Identity;
//# sourceMappingURL=identity.js.map