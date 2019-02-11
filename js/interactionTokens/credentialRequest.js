"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonlogic = require("json-logic-js");
var class_transformer_1 = require("class-transformer");
var CredentialRequest = (function () {
    function CredentialRequest() {
        this._credentialRequirements = [];
    }
    CredentialRequest_1 = CredentialRequest;
    Object.defineProperty(CredentialRequest.prototype, "credentialRequirements", {
        get: function () {
            return this._credentialRequirements;
        },
        set: function (requirements) {
            this._credentialRequirements = requirements;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CredentialRequest.prototype, "callbackURL", {
        get: function () {
            return this._callbackURL;
        },
        set: function (callback) {
            this._callbackURL = callback;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CredentialRequest.prototype, "requestedCredentialTypes", {
        get: function () {
            return this.credentialRequirements.map(function (credential) { return credential.type; });
        },
        enumerable: true,
        configurable: true
    });
    CredentialRequest.prototype.applyConstraints = function (credentials) {
        var _this = this;
        return credentials.filter(function (credential) {
            var relevantConstraints = _this.credentialRequirements.find(function (section) {
                return areCredTypesEqual(section.type, credential.type);
            });
            if (!relevantConstraints) {
                return false;
            }
            if (!relevantConstraints.constraints.length) {
                return credential;
            }
            var combinedRequirements = { and: relevantConstraints.constraints };
            if (relevantConstraints) {
                return jsonlogic.apply(combinedRequirements, credential);
            }
        });
    };
    CredentialRequest.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    CredentialRequest.fromJSON = function (json) {
        return class_transformer_1.plainToClass(CredentialRequest_1, json);
    };
    var CredentialRequest_1;
    __decorate([
        class_transformer_1.Expose()
    ], CredentialRequest.prototype, "credentialRequirements", null);
    __decorate([
        class_transformer_1.Expose()
    ], CredentialRequest.prototype, "callbackURL", null);
    CredentialRequest = CredentialRequest_1 = __decorate([
        class_transformer_1.Exclude()
    ], CredentialRequest);
    return CredentialRequest;
}());
exports.CredentialRequest = CredentialRequest;
exports.constraintFunctions = {
    is: function (field, value) { return assembleStatement('==', field, value); },
    not: function (field, value) { return assembleStatement('!=', field, value); },
    greater: function (field, value) { return assembleStatement('>', field, value); },
    smaller: function (field, value) { return assembleStatement('<', field, value); }
};
var assembleStatement = function (operator, field, value) {
    var _a;
    return _a = {}, _a[operator] = [{ var: field }, value], _a;
};
var areCredTypesEqual = function (first, second) {
    return first.every(function (el, index) { return el === second[index]; });
};
//# sourceMappingURL=credentialRequest.js.map