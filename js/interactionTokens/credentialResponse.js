"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_transformer_1 = require("class-transformer");
var signedCredential_1 = require("../credentials/signedCredential/signedCredential");
var CredentialResponse = (function () {
    function CredentialResponse() {
    }
    Object.defineProperty(CredentialResponse.prototype, "suppliedCredentials", {
        get: function () {
            return this._suppliedCredentials;
        },
        set: function (suppliedCredentials) {
            this._suppliedCredentials = suppliedCredentials;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CredentialResponse.prototype, "callbackURL", {
        get: function () {
            return this._callbackURL;
        },
        set: function (callbackURL) {
            this._callbackURL = callbackURL;
        },
        enumerable: true,
        configurable: true
    });
    CredentialResponse.prototype.satisfiesRequest = function (cr) {
        var credentials = this.suppliedCredentials.map(function (sCredClass) { return sCredClass.toJSON(); });
        var validCredentials = cr.applyConstraints(credentials);
        return !!this.suppliedCredentials.length && (this.suppliedCredentials.length === validCredentials.length);
    };
    CredentialResponse.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    CredentialResponse.fromJSON = function (json) {
        return class_transformer_1.plainToClass(this, json);
    };
    __decorate([
        class_transformer_1.Expose(),
        class_transformer_1.Type(function () { return signedCredential_1.SignedCredential; })
    ], CredentialResponse.prototype, "suppliedCredentials", null);
    __decorate([
        class_transformer_1.Expose()
    ], CredentialResponse.prototype, "callbackURL", null);
    CredentialResponse = __decorate([
        class_transformer_1.Exclude()
    ], CredentialResponse);
    return CredentialResponse;
}());
exports.CredentialResponse = CredentialResponse;
//# sourceMappingURL=credentialResponse.js.map