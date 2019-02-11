"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_transformer_1 = require("class-transformer");
var contexts_1 = require("../../utils/contexts");
var Credential = (function () {
    function Credential() {
    }
    Credential_1 = Credential;
    Object.defineProperty(Credential.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Credential.prototype, "claim", {
        get: function () {
            return this._claim;
        },
        set: function (claim) {
            this._claim = claim;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Credential.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            this._type = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Credential.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Credential.prototype, "context", {
        get: function () {
            return this['_@context'];
        },
        set: function (context) {
            this['_@context'] = context;
        },
        enumerable: true,
        configurable: true
    });
    Credential.create = function (_a) {
        var metadata = _a.metadata, claim = _a.claim, subject = _a.subject;
        var credential = new Credential_1();
        credential.context = contexts_1.defaultContext.concat(metadata.context);
        credential.type = metadata.type;
        credential.name = metadata.name;
        credential.claim = claim;
        credential.claim.id = subject;
        return credential;
    };
    Credential.fromJSON = function (json) {
        return class_transformer_1.plainToClass(Credential_1, json);
    };
    Credential.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    var Credential_1;
    __decorate([
        class_transformer_1.Expose()
    ], Credential.prototype, "claim", null);
    __decorate([
        class_transformer_1.Expose()
    ], Credential.prototype, "type", null);
    __decorate([
        class_transformer_1.Expose()
    ], Credential.prototype, "name", null);
    __decorate([
        class_transformer_1.Expose({ name: '@context' })
    ], Credential.prototype, "context", null);
    Credential = Credential_1 = __decorate([
        class_transformer_1.Exclude()
    ], Credential);
    return Credential;
}());
exports.Credential = Credential;
//# sourceMappingURL=credential.js.map