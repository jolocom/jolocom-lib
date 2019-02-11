"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_transformer_1 = require("class-transformer");
var CredentialOffer = (function () {
    function CredentialOffer() {
    }
    Object.defineProperty(CredentialOffer.prototype, "instant", {
        get: function () {
            return this._instant;
        },
        set: function (instant) {
            this._instant = instant;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CredentialOffer.prototype, "requestedInput", {
        get: function () {
            return this._requestedInput;
        },
        set: function (requestedInput) {
            this._requestedInput = requestedInput;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CredentialOffer.prototype, "callbackURL", {
        get: function () {
            return this._callbackURL;
        },
        set: function (callbackURL) {
            this._callbackURL = callbackURL;
        },
        enumerable: true,
        configurable: true
    });
    CredentialOffer.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    CredentialOffer.fromJSON = function (json) {
        return class_transformer_1.plainToClass(this, json);
    };
    __decorate([
        class_transformer_1.Expose()
    ], CredentialOffer.prototype, "instant", null);
    __decorate([
        class_transformer_1.Expose()
    ], CredentialOffer.prototype, "requestedInput", null);
    __decorate([
        class_transformer_1.Expose()
    ], CredentialOffer.prototype, "callbackURL", null);
    CredentialOffer = __decorate([
        class_transformer_1.Exclude()
    ], CredentialOffer);
    return CredentialOffer;
}());
exports.CredentialOffer = CredentialOffer;
//# sourceMappingURL=credentialOffer.js.map