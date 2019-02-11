"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_transformer_1 = require("class-transformer");
var typeToAuthType = {
    Secp256k1VerificationKey2018: 'Secp256k1SignatureAuthentication2018'
};
var AuthenticationSection = (function () {
    function AuthenticationSection() {
    }
    AuthenticationSection_1 = AuthenticationSection;
    Object.defineProperty(AuthenticationSection.prototype, "publicKey", {
        get: function () {
            return this._publicKey;
        },
        set: function (key) {
            this._publicKey = key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthenticationSection.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    AuthenticationSection.fromEcdsa = function (publicKeySection) {
        var authSection = new AuthenticationSection_1();
        authSection.publicKey = publicKeySection.id;
        authSection.type = typeToAuthType[publicKeySection.type];
        return authSection;
    };
    AuthenticationSection.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    AuthenticationSection.prototype.fromJSON = function (json) {
        return class_transformer_1.plainToClass(AuthenticationSection_1, json);
    };
    var AuthenticationSection_1;
    __decorate([
        class_transformer_1.Expose()
    ], AuthenticationSection.prototype, "publicKey", null);
    __decorate([
        class_transformer_1.Expose()
    ], AuthenticationSection.prototype, "type", null);
    AuthenticationSection = AuthenticationSection_1 = __decorate([
        class_transformer_1.Exclude()
    ], AuthenticationSection);
    return AuthenticationSection;
}());
exports.AuthenticationSection = AuthenticationSection;
//# sourceMappingURL=authenticationSection.js.map