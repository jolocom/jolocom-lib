"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var class_transformer_1 = require("class-transformer");
var PublicKeySection = (function () {
    function PublicKeySection() {
    }
    PublicKeySection_1 = PublicKeySection;
    Object.defineProperty(PublicKeySection.prototype, "owner", {
        get: function () {
            return this._owner;
        },
        set: function (owner) {
            this._owner = owner;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublicKeySection.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublicKeySection.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PublicKeySection.prototype, "publicKeyHex", {
        get: function () {
            return this._publicKeyHex;
        },
        set: function (keyHex) {
            this._publicKeyHex = keyHex;
        },
        enumerable: true,
        configurable: true
    });
    PublicKeySection.fromEcdsa = function (publicKey, id, did) {
        var publicKeySecion = new PublicKeySection_1();
        publicKeySecion.owner = did;
        publicKeySecion.id = id;
        publicKeySecion.type = 'Secp256k1VerificationKey2018';
        publicKeySecion.publicKeyHex = publicKey.toString('hex');
        return publicKeySecion;
    };
    PublicKeySection.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    PublicKeySection.prototype.fromJSON = function (json) {
        return class_transformer_1.plainToClass(PublicKeySection_1, json);
    };
    var PublicKeySection_1;
    __decorate([
        class_transformer_1.Expose()
    ], PublicKeySection.prototype, "owner", null);
    __decorate([
        class_transformer_1.Expose()
    ], PublicKeySection.prototype, "id", null);
    __decorate([
        class_transformer_1.Expose()
    ], PublicKeySection.prototype, "type", null);
    __decorate([
        class_transformer_1.Expose()
    ], PublicKeySection.prototype, "publicKeyHex", null);
    PublicKeySection = PublicKeySection_1 = __decorate([
        class_transformer_1.Exclude()
    ], PublicKeySection);
    return PublicKeySection;
}());
exports.PublicKeySection = PublicKeySection;
//# sourceMappingURL=publicKeySection.js.map